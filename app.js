const checkButtonEle = document.querySelector('#check');
const section = document.querySelector('section');
const form = document.querySelector('form');
const res = await fetch('verses.json');
const data = await res.json();
const signIn = document.getElementById('sign-in');
const signInBtn = document.getElementById('user-login');
const signInForm = document.getElementById('sign-in-form');
const signUp = document.getElementById('sign-up');

let book;
let chapter;
let verse;

signIn.addEventListener('click', () => {
  if (document.querySelector('.sign-up').classList.contains('open')) return;
  document.querySelector('.login').classList.toggle('not-active');
  document.querySelector('.login').classList.toggle('open');
});
signUp.addEventListener('click', () => {
  if (document.querySelector('.login').classList.contains('open')) return;
  document.querySelector('.sign-up').classList.toggle('not-active');
  document.querySelector('.sign-up').classList.toggle('open');
});

//
signInForm.addEventListener('submit', submitForm);
async function submitForm(e) {
  e.preventDefault();
  const email = document.getElementById('email');
  const username = document.getElementById('name');
  const submitter = e.submitter.id;
  console.log(submitter);
  // Sign Up
  if (submitter === 'sign-up') {
    console.log('YEYE');
    const data = {
      name: username.value,
      email: email.value,
    };
    // API Call to add email to data base
    const res = await fetch('http://localhost:3000/users', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'content-type': 'application/json',
      },
      // Need to stringify the data
      body: JSON.stringify(data),
    });
    const message = await res.json();
    console.log(message);
  }
  // Login
  if (submitter === 'user-login') {
    const email = document.getElementById('loginEmail');
    await fetch(`http://localhost:3000/users/${email.value}`)
      // Check status first rather than doing both
      .then((res) => Promise.all([res, res.json()]))
      .then((data) => {
        console.log(data);
        if (data[0]) {
          document.getElementById(
            'user'
          ).textContent = `Welcome back ${data[1].name}!`;
          // document
          // .getElementById('verse-display')
          // .classList.toggle('not-active');
          // signIn.classList.toggle('not-active');
        }
      });
  }
}

function randomVerse(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function fetchData(url = '') {
  const response = await fetch(url);
  const verse = await response.json();

  return verse;
}

// form.addEventListener('submit', handleSubmit);

function loadRandomVerse({ book, chapter, verse } = randomVerse(data)) {
  let query = `${book} ${chapter}:${verse}`;
  // form.classList.toggle('not-active');
  checkButtonEle.classList.toggle('not-active');
  fetchData(`https://bible-api.com/${query}`).then(display);
}

loadRandomVerse();

function handleSubmit(e) {
  e.preventDefault();
  book = document.getElementById('book').value;
  chapter = document.getElementById('chapter').value;
  verse = document.getElementById('verse').value;
  let query = `${book} ${chapter}:${verse}`;
  form.classList.toggle('not-active');
  checkButtonEle.classList.toggle('not-active');
  fetchData(`https://bible-api.com/${query}`).then(display);
}

function display(verse) {
  const h2 = document.querySelector('h2');
  const verseSplit = verse.text.split(' ');
  const chunkedVerse = chunkWithMinSize(verseSplit, 4, 3);
  const shuffledChunkedVerse = shuffle(chunkedVerse);

  h2.textContent = verse.reference;
  shuffledChunkedVerse.map((section, index) => {
    const div = document.createElement('div');
    const p = document.createElement('p');
    const dragAndDropEle = document.getElementById('drag-and-drop');
    const versionSectionEle = document.getElementById('verse-section');
    dragAndDropEle.appendChild(div);
    versionSectionEle.append(p);
    p.textContent = section;
    div.classList.add('droppable');
    div.id = `drop-${index}`;
    div.addEventListener('drop', handleDrop);
    div.addEventListener('dragover', allowDrop);

    p.classList.add('verse-section');
    p.id = `drag-${index}`;
    p.addEventListener('dragstart', handleDrag);

    p.draggable = 'true';
    return verse;
  });
  checkButtonEle.addEventListener('click', () => handleClick(verse));
}

function handleClick(verse) {
  const verseCollection = document.getElementsByClassName('droppable');
  const userSubmission = [];
  for (let i = 0; i < verseCollection.length; i++) {
    const firstChild = verseCollection[i].firstChild;
    userSubmission.push(firstChild.textContent);
  }
  // console.log(verse.text);
  // console.log(userSubmission.join(' '));
  const droppableEle = document.querySelectorAll('.droppable');
  if (userSubmission.join(' ') === verse.text) {
    for (let i = 0; i < droppableEle.length; i++) {
      droppableEle[i].style.backgroundColor = 'lawngreen';
    }
    return;
  }
}

// split array into chunks
//! https://www.30secondsofcode.org/js/s/split-array-into-chunks/
function chunkWithMinSize(arr, chunkSize, minChunkSize = 0) {
  // How many elements will be left over
  const remainder = arr.length % chunkSize;
  // Check if the last check is too small
  const isLastChunkTooSmall = remainder < minChunkSize;
  const totalChunks = isLastChunkTooSmall
    ? // if last chunk is to small total chunk is rounded down
      Math.floor(arr.length / chunkSize)
    : // if last chunk is to big total chunk is rounded up
      Math.ceil(arr.length / chunkSize);
  return Array.from({ length: totalChunks }, (item, i) => {
    const chunk = arr.slice(i * chunkSize, i * chunkSize + chunkSize);
    if (i === totalChunks - 1 && isLastChunkTooSmall)
      chunk.push(...arr.slice(-remainder));
    return chunk.join(' ');
  });
}

//! www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/https:
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    // create a random number of 1 + 1
    const j = Math.floor(Math.random() * (i + 1));
    // switch the indexes of i and the random index (j)
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
// console.log(verseSplit.slice(0, 3));
// console.log(verseSplit.slice(3, 6));
// console.log(verseSplit.slice(6, 9));

// create the drag a drop items via shuffled array
// check if the user put verse in the correct order by comparing it to the original verse
//! https://www.w3schools.com/html/html5_draganddrop.asp

function handleDrag(e) {
  console.log(e);
  e.dataTransfer.setData('text', e.target.id);
}

function allowDrop(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const data = e.dataTransfer.getData('text');
  e.target.append(document.getElementById(data));
}
