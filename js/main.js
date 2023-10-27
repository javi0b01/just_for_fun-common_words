'use strict';
import { getAllWords, getDayWords } from './words.js';

const d = document;

const $btnsDay = d.querySelectorAll('.btn-day'),
  $words = d.getElementById('words'),
  $exercises = d.getElementById('exercises'),
  $messages = d.getElementById('messages');

d.addEventListener('DOMContentLoaded', () => {
  monitorEvents();
});

const monitorEvents = () => {
  $btnsDay.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      showWords(+e.target.id);
    });
  });
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
  const h3 = id === 0 ? 'All' : `Day ${id}`;
  let tbody = '';
  for (const [i, word] of words.entries()) {
    tbody += `
<tr>
  <td>${i + 1}</td>
  <td>${word.english}</td>
  <td>${word.spanish}</td>
  <td>${word.example}</td>
</tr>
`;
  }
  return `
<h2>Words</h2>
<div>
  <h3>${h3}</h3>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>English</th>
        <th>Spanish</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>${tbody}</tbody>
    <tfoot>
      <tr>
        <td>
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
  });
  const $wordsForm = d.getElementById('wordsForm');
  $wordsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    for (const key in formData) {
      const value = formData[key];
      if (!value) return ($messages.textContent = 'All fields are required.');
      if (key != value) return ($messages.textContent = 'Failured.');
    }
    $messages.textContent = 'Success!.';
  });
  $wordsForm.addEventListener('reset', (e) => {
    $messages.textContent = null;
  });
};

const getExercisesHtml = (id, words) => {
  const h3 = id === 0 ? 'Type the words' : `Type the words of the day ${id}`;
  let fields = '';
  for (const word of words) {
    fields += `
<div>
  <label for="${word.id}">${word.spanish}</label>
  <input id="${word.id}" type="text" placeholder="Type in English" name="${word.english}" autocomplete="off" />
</div>
`;
  }
  return `
<h2>Exercises</h2>
<h3>${h3}</h3>
<form id="wordsForm">
${fields}
<button type="submit">Check</button>
<button type="reset">Reset</button>
<button type="button" id="backBtn">Back</button>
</form>
`;
};
