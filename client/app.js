import {
  chunkWithMinSize,
  randomVerse,
  loadRandomVerse,
  shuffle,
  handleDrag,
  allowDrop,
  handleDrop,
  checkVerse,
} from './utils.js';
import { incrementScore } from './form.js';
window.addEventListener('load', async (e) => {
  // TODO
  // ? MAJOR
  // Allow 5 times a day

  // ? MINOR
  // Styling
  // Timer
  const res = await fetch('verses.json');
  const data = await res.json();

  let mode;
  if (window.innerWidth <= 750) {
    mode = 'mobile';
  } else {
    mode = 'desktop';
  }
  const checkButtonEle = document.querySelector('#check');
  const section = document.querySelector('section');
  let book;
  let chapter;
  // let verse;
  const instructions = document.getElementById('instructions');
  const main = document.getElementById('main');
  const scores = document.getElementById('scores');
  const middleDisplay = document.getElementById('middle-display');
  const dragAndDrop = document.getElementById('drag-and-drop');
  const instructionsDisplay = document.getElementById('instructions-display');
  const mainDisplay = document.getElementById('main-display');
  const scoresDisplay = document.getElementById('scores-display');
  const bottomVerses = document.getElementById('bottom-verses');
  const bottomNav = document.getElementById('bottom-nav');
  const startGameBtn = document.getElementById('start-game');

  const verse =
    '16 All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness: 17 That the man of God may be perfect, throughly furnished unto all good works.';
  const chunks = chunkWithMinSize(verse.split(' '), 4, 3);
  console.log(chunks);
  const order = chunks.map((_, i) => i + 1);
  // loadRandomVerse();

  display(verse);

  const verseChunks = document.getElementsByClassName('verse-chunk');

  function display(verse) {
    console.log(verse);
    const h2 = document.querySelector('h2');
    const verseSplit = verse.split(' ');
    const chunkedVerse = chunkWithMinSize(verseSplit, 4, 3);
    const shuffledChunkedVerse = shuffle(chunkedVerse);

    h2.textContent = verse.reference;
    shuffledChunkedVerse.map((section, index) => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      const p = document.createElement('p');
      const dragAndDropEle = document.getElementById('drag-and-drop');
      const versionSectionEle = document.getElementById('verse-section');
      div.classList.add('verse-chunk');
      dragAndDropEle.appendChild(div);
      versionSectionEle.append(p);
      span.id;
      p.textContent = section;
      p.append(span);
      div.classList.add('droppable');
      div.id = `drop-${index}`;
      if (mode === 'mobile') {
        p.addEventListener('click', handleSelect);
      } else {
        div.addEventListener('drop', handleDrop);
        div.addEventListener('dragover', allowDrop);
      }
      p.id = `drag-${index}`;
      p.addEventListener('dragstart', handleDrag);

      p.draggable = 'true';
      p.classList.add('verse-section');
      return verse;
    });
    checkButtonEle.addEventListener('click', () => handleClick(verse));
  }

  function handleClick() {
    const droppableEle = document.querySelectorAll('.droppable');
    const selectedEle = document.querySelectorAll('.selected');
    bottomNav.classList.toggle('not-active');
    if (mode === 'mobile') {
      checkVerse(mode, selectedEle, chunks);
      updateScore(selectedEle);
    }
    if (mode === 'desktop') {
      checkVerse(mode, droppableEle, chunks);
      updateScore(droppableEle);
    }
  }

  function updateScore(arr) {
    // NodeLists are not arrays
    const convertedArr = [...arr];
    console.log(convertedArr[0].style.backgroundColor);
    convertedArr.every((item) => {
      if (item.style.backgroundColor === 'lawngreen') {
        incrementScore();
        // Update score
      }
    });
  }

  // create the drag a drop items via shuffled array
  // check if the user put verse in the correct order by comparing it to the original verse
  //! https://www.w3schools.com/html/html5_draganddrop.asp

  function handleSelect(e) {
    console.log(e);
    if (e.target.classList[0] === 'verse-section') {
      if (e.target.classList.contains('selected')) {
        const currentItem = +e.target.id;
        // Remove from the index of the item in the array
        e.target.classList.toggle('selected');
        e.target.children[0].textContent = '';
        e.target.removeAttribute('id');
        order.unshift(currentItem);
        order.sort();
        return;
      }
      e.target.classList.toggle('selected');
      const currentOrder = order.shift();
      e.target.children[0].textContent = currentOrder;
      e.target.id = currentOrder;
    }
  }

  main.onclick = function () {
    mainDisplay.style.display = 'block';
    dragAndDrop.style.display = 'none';
    instructionsDisplay.style.display = 'none';
    scoresDisplay.style.display = 'none';
  };

  instructions.onclick = function () {
    instructionsDisplay.style.display = 'block';
    dragAndDrop.style.display = 'none';
    mainDisplay.style.display = 'none';
    scoresDisplay.style.display = 'none';
  };

  scores.onclick = function () {
    scoresDisplay.style.display = 'block';
    dragAndDrop.style.display = 'none';
    instructionsDisplay.style.display = 'none';
    mainDisplay.style.display = 'none';
    fetchScores('http://localhost:3000/users');
  };

  function createLeaderboard(arr) {
    arr.sort((user1, user2) => user2.score - user1.score);
    return arr
      .map((user) => {
        return `
      <div class='user-score'>
        <span class='first-name'>${user.name}:</span><span>${user.score}</>
      </div>
      `;
      })
      .join('');
  }

  async function fetchScores(db) {
    const scoresDisplayEle = document.querySelector('#scores-display');
    const res = await fetch(db);
    const data = await res.json();
    scoresDisplayEle.innerHTML = createLeaderboard(data);
  }

  startGameBtn.onclick = function () {
    const bottomDisplay = document.getElementById('bottom-display');
    const verseSection = document.getElementById('verse-section');
    checkButtonEle.classList.toggle('not-active');
    bottomDisplay.classList.toggle('not-active');
    if (mode === 'mobile') {
      dragAndDrop.style.display = 'none';
      mainDisplay.style.display = 'none';
      middleDisplay.style.display = 'none';
      bottomVerses.style.display = 'grid';
      verseSection.style.display = 'block';
    }

    if (mode === 'desktop') {
      mainDisplay.style.display = 'none';
      dragAndDrop.style.display = 'grid';
      verseSection.style.display = 'grid';
    }
  };
});
