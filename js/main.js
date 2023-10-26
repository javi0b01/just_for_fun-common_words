'use strict';
import { getDayWords } from './words.js';

const d = document,
  dayWords1 = getDayWords(1);

const $words = d.getElementById('words'),
  $day1 = d.getElementById('day1'),
  $btnsExercise = d.querySelectorAll('.btn-exercise'),
  $exercises = d.getElementById('exercises');

let html = '';

d.addEventListener('DOMContentLoaded', () => {
  setWordsLists();
  eventsListener();
});

const setWordsLists = () => {
  for (const word of dayWords1) {
    html += `
<tr>
  <td>${word.english}</td>
  <td>${word.spanish}</td>
  <td>${word.example}</td>
</tr>
`;
  }
  $day1.innerHTML = html;
  html = '';
};

const eventsListener = () => {
  $btnsExercise.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      setExercise(+e.target.id);
    });
  });
};

const setExercise = (id) => {
  $words.classList.toggle('d-none');
  html = `
<h2>Exercises</h2>
<h3>Type the words of the day</h3>
<form id="wordsForm">
`;
  for (const word of dayWords1) {
    html += `
<div>
  <label for="${word.id}">${word.spanish}</label>
  <input id="${word.id}" type="text" placeholder="Type in English" name="${word.english}" autocomplete="off" />
</div>
`;
  }
  html += `
<button type="submit">Check</button>
<button type="reset">Reset</button>
<button id="backBtn" type="button">Back</button>
</form>
<p id="result"></p>
  `;
  $exercises.innerHTML = html;
  html = '';
  const $backBtn = d.getElementById('backBtn');
  $backBtn.addEventListener('click', () => {
    $words.classList.toggle('d-none');
    $exercises.innerHTML = null;
  });
  const $result = d.getElementById('result');
  const $wordsForm = d.getElementById('wordsForm');
  $wordsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    for (const key in formData) {
      const value = formData[key];
      if (!value) return ($result.textContent = 'All fields are required.');
      if (key != value) return ($result.textContent = 'Failured.');
    }
    $result.textContent = 'Success!.';
  });
  $wordsForm.addEventListener('reset', (e) => {
    $result.textContent = null;
  });
};
