'use strict';
import { getNumberDays, getAllWords, getDayWords } from './words.js';

const d = document;

const $day = d.getElementById('day'),
  $cards = d.getElementById('cards'),
  $words = d.getElementById('words'),
  $exercises = d.getElementById('exercises'),
  $message = d.getElementById('message');

d.addEventListener('DOMContentLoaded', () => {
  setSelectDay();
});

const setSelectDay = () => {
  const numberDays = getNumberDays();
  let optionsHtml = '<option value="" disabled selected>...</option>';
  for (let i = 1; i <= numberDays; i++) {
    optionsHtml += `
    <option value="${i}">Words Day ${i}</option>
`;
  }
  optionsHtml += '<option value="0">All Words</option>';
  $day.innerHTML = optionsHtml;
  $day.addEventListener('click', (e) => {
    if (e.target.value != '') showWords(+e.target.value);
  });
};

const handleMessage = (type, message) => {
  $message.className = '';
  if (type && message) {
    $message.classList.add('message', type);
    $message.textContent = message;
  } else $message.textContent = null;
};

const showWords = (id) => {
  if ($words.classList.contains('d-none')) {
    $words.classList.toggle('d-none');
    $exercises.innerHTML = null;
  }
  const words = id === 0 ? getAllWords() : getDayWords(id);
  const wordsHtml = getWordsHtml(id, words);
  $words.innerHTML = wordsHtml;
  const $btnExercises = d.getElementById('btnExercises');
  $btnExercises.addEventListener('click', () => {
    showExercises(id, words);
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
          <button type="button" class="btn btn-exercise" id="btnExercises">
            Exercises
          </button>
        </td>
      </tr>
    </tfoot>
  </table>
</div>
  `;
};

const showExercises = (id, words) => {
  $words.classList.toggle('d-none');
  const exercisesHtml = getExercisesHtml(id, words);
  $exercises.innerHTML = exercisesHtml;
  const $backBtn = d.getElementById('backBtn');
  $backBtn.addEventListener('click', () => {
    $words.classList.toggle('d-none');
    $exercises.innerHTML = null;
    handleMessage();
  });
  const $wordsForm = d.getElementById('wordsForm');
  $wordsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    for (const key in formData) {
      const value = formData[key].toLowerCase().trim();
      if (!value) return handleMessage('warning', 'All fields are required.');
      if (key != value) return handleMessage('warning', 'Failured.');
    }
    handleMessage('success', 'Success!.');
  });
  $wordsForm.addEventListener('reset', (e) => {
    handleMessage();
  });
};

const getExercisesHtml = (id, words) => {
  const h3 = id === 0 ? 'Type the words' : `Type the words of the day ${id}`;
  let fields = '';
  for (const word of words) {
    fields += `
<input type="text" placeholder='Type "${word.spanish}" in English' name="${word.english}" autocomplete="off" />
`;
  }
  return `
<h2>Exercises</h2>
<h3>${h3}</h3>
<form id="wordsForm">
${fields}
<div>
  <button type="submit">Check</button>
  <button type="reset">Reset</button>
  <button type="button" id="backBtn">Back</button>
</div>
</form>
`;
};
