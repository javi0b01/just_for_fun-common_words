'use strict';
import { getNumberDays, getAllWords, getDayWords } from './words.js';

const d = document;

const $day = d.getElementById('day'),
  $words = d.getElementById('words'),
  $practice = d.getElementById('practice'),
  $aside = d.getElementById('aside');

let rightWords = null,
  i = 0;

d.addEventListener('DOMContentLoaded', () => {
  setSelectDay();
});

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
    } else $aside.classList.remove('d-none');
  });
};

const showWords = (id) => {
  if ($words.classList.contains('d-none')) {
    $words.classList.toggle('d-none');
    $practice.innerHTML = null;
  }
  const words = id === 0 ? getAllWords() : getDayWords(id),
    wordsHtml = getWordsHtml(id, words);
  $words.innerHTML = wordsHtml;
  const $btnPractice = d.getElementById('btnPractice');
  $btnPractice.addEventListener('click', () => {
    startPractice(id, words);
  });
};

const getWordsHtml = (id, words) => {
  const title = id === 0 ? 'All Days' : `Day ${id}`;
  let cards = '';
  for (const [i, word] of words.entries()) {
    cards += `
      <div class="card">
        <p>Word ${i + 1}</p>
        <p>
          ${toCapitalize(word.english)} 🇺🇸 &nbsp;&nbsp; 🇨🇴 ${toCapitalize(
      word.spanish
    )}
        </p>
        <ul>
          <li>${word.englishSample}</li>
          <li>${word.spanishTranslation}</li>
          ${
            word.plus
              ? `<div class="divide"></div><li>${word.plus[0]}</li><li>${word.plus[1]}</li>`
              : ''
          }
        </ul>
      </div>
    `;
  }
  return `
    <h2>${title}</h2>
    <div class="cards">
      ${cards}
    </div>
    <button type="button" class="btn-practice" id="btnPractice">
      Practice
    </button>
  `;
};

const toCapitalize = (word) => {
  const capitalize = word.charAt(0).toUpperCase();
  return capitalize.concat(word.substring(1));
};

const startPractice = (id, words) => {
  rightWords = [];
  i = 0;
  $words.classList.toggle('d-none');
  const practiceHtml = getPracticeHtml(id);
  $practice.innerHTML = practiceHtml;
  const $backBtn = d.getElementById('backBtn');
  $backBtn.addEventListener('click', () => {
    $words.classList.toggle('d-none');
    $practice.innerHTML = null;
  });
  setCard(words, i);
};

const getPracticeHtml = (id) => {
  const h3 = id === 0 ? 'Type the words' : `Type the words of the day ${id}`;
  return `
    <div class="practice">
      <button type="button" id="backBtn" class="btn-back">Back</button>
      <h2>Practice</h2>
      <h3>${h3}</h3>
      <h4 id="count"></h4>
      <div id="card"></div>
    </div>
  `;
};

const setCard = (words, i) => {
  setCount(words);
  const $card = d.getElementById('card');
  $card.innerHTML = getCardHtml(words[i]);
  const $cardForm = d.getElementById('cardForm'),
    $input = d.getElementById('input');
  $input.focus();
  $cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    const isRight = checkInput(formData);
    if (isRight) {
      rightWords.push(true);
      if (rightWords.length === words.length) {
        setCount(words);
        $card.innerHTML = '<p id="message"></p>';
        $card.style.justifyContent = 'center';
        handleMessage('msg-success', 'Good job! 🥳');
      } else {
        handleMessage('msg-success', '👌🏽');
        setTimeout(() => {
          handleMessage();
          i++;
          setCard(words, i);
        }, 1000);
      }
    }
  });
};

const setCount = (words) => {
  const $count = d.getElementById('count');
  $count.textContent = `${rightWords.length}/${words.length} ${
    rightWords.length === words.length ? '🚀' : '👀'
  }`;
};

const getCardHtml = (word) => {
  return `
    <p>Type in English</p>
    <p>"${word.spanish}"</p>
    <form id="cardForm">
      <input type="text" autocomplete="off" name="${word.english}" id="input"/>
      <button type="submit" class="btn-done">Done!</button>
    </form>
    <p id="message"></p>
  `;
};

const checkInput = (obj) => {
  const key = Object.keys(obj)[0],
    value = obj[key].toLowerCase().trim();
  if (!value) {
    handleMessage('msg-warning', 'Type the word! 😩');
    return false;
  }
  if (key === value) return true;
  else {
    handleMessage('msg-warning', 'Try again! 😞');
    return false;
  }
};

const handleMessage = (type, message) => {
  const $message = d.getElementById('message');
  $message.className = '';
  if (type && message) {
    $message.classList.add(type);
    $message.textContent = message;
  } else $message.textContent = '';
};
