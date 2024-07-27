'use strict';
import { getNumberDays, getAllWords, getDayWords } from './words.js';

const d = document;

const $translate = d.getElementById('translate'),
  $day = d.getElementById('day'),
  $words = d.getElementById('words'),
  $practice = d.getElementById('practice'),
  $aside = d.getElementById('aside');

let rightWords = null,
  i = 0;

d.addEventListener('DOMContentLoaded', () => {
  $translate.addEventListener('click', handleTranslate);
  setSelectDay();
});

const handleTranslate = () => {};

const setSelectDay = () => {
  const numberDays = getNumberDays();
  let optionsHtml =
    '<option value="" disabled selected>Choose a day ... </option>';
  for (let i = 1; i <= numberDays; i++) {
    optionsHtml += `
    <option value="${i}">Words Day ${i}</option>
`;
  }
  optionsHtml += '<option value="0">All Words</option>';
  $day.innerHTML = optionsHtml;
  $day.addEventListener('click', (e) => {
    if (e.target.value != '') {
      $aside.classList.add('d-none');
      showWords(+e.target.value);
    } else {
      $aside.classList.remove('d-none');
    }
  });
};

const showWords = (id) => {
  if ($words.classList.contains('d-none')) {
    $words.classList.toggle('d-none');
    $practice.innerHTML = null;
  }
  const words = id === 0 ? getAllWords() : getDayWords(id);
  const wordsHtml = getWordsHtml(id, words);
  $words.innerHTML = wordsHtml;
  const $btnPractice = d.getElementById('btnPractice');
  $btnPractice.addEventListener('click', () => {
    startPractice(id, words);
  });
};

const getWordsHtml = (id, words) => {
  const h3 = id === 0 ? 'All Days' : `Day ${id}`;
  let tbody = '';
  for (const [i, word] of words.entries()) {
    tbody += `
<tr>
  <td class="text-center">${i + 1}</td>
  <td>${word.english}</td>
  <td>${word.spanish}</td>
  <td>
  <p>${word.englishSample}</p>
  <p>${word.spanishTranslation}</p>
  ${
    word.plus
      ? `<div class="divide"></div><p>${word.plus[0]}</p><p>${word.plus[1]}</p>`
      : ''
  }
  </td>
</tr>
`;
  }
  return `
<h2>Words</h2>
<div class="table-wrap">
  <table>
    <caption>${h3}</caption>
    <thead>
      <tr>
        <th>#</th>
        <th>English</th>
        <th>Spanish</th>
        <th>Examples</th>
      </tr>
    </thead>
    <tbody>${tbody}</tbody>
    <tfoot>
      <tr>
        <td colspan="4" class="text-center">
          <button type="button" class="btn btn-practice" id="btnPractice">
            Practice
          </button>
        </td>
      </tr>
    </tfoot>
  </table>
</div>
  `;
};

const getPracticeHtml = (id, words) => {
  const h3 = id === 0 ? 'Type the words' : `Type the words of the day ${id}`;
  return `
<button type="button" id="backBtn">Back</button>
<h2>Practice</h2>
<h3>${h3}</h3>
<h4 id="count"></h4>
<div id="card"></div>
  `;
};

const handleMessage = (type, message) => {
  const $message = d.getElementById('message');
  $message.className = '';
  $message.classList.add('message', type);
  $message.textContent = message;
};

const getCardHtml = (word) => {
  return `
    <p>Type "${word.spanish}" in English</p>
    <form id="cardForm">
      <input type="text" autocomplete="off" name="${word.english}" id="input"/>
      <button type="submit">Done!</button>
    </form>
    <p id="message"></p>
  `;
};

const checkInput = (obj) => {
  const key = Object.keys(obj)[0];
  const value = obj[key].toLowerCase().trim();
  if (!value) {
    handleMessage('warning', 'All fields are required.');
    return false;
  }
  if (key === value) {
    handleMessage('success', 'Success!.');
    return true;
  } else {
    handleMessage('warning', 'Failured.');
    return false;
  }
};

const setCount = (words) => {
  const $count = d.getElementById('count');
  $count.textContent = `${rightWords.length}/${words.length}`;
};

const setCard = (words, i) => {
  setCount(words);
  const $card = d.getElementById('card');
  $card.innerHTML = getCardHtml(words[i]);
  const $cardForm = d.getElementById('cardForm');
  const $input = d.getElementById('input');
  $input.focus();
  $cardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    const isRight = await checkInput(formData);
    if (isRight) {
      rightWords.push(true);
      if (rightWords.length === words.length) {
        setCount(words);
        $card.innerHTML = '<p id="message"></p>';
        handleMessage('success', 'Done!');
      } else {
        i++;
        setCard(words, i);
      }
    }
  });
};

const startPractice = (id, words) => {
  rightWords = [];
  i = 0;
  $words.classList.toggle('d-none');
  const practiceHtml = getPracticeHtml(id, words);
  $practice.innerHTML = practiceHtml;
  const $backBtn = d.getElementById('backBtn');
  $backBtn.addEventListener('click', () => {
    $words.classList.toggle('d-none');
    $practice.innerHTML = null;
  });
  setCard(words, i);
};
