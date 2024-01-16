const buttonEle = document.querySelector('button');
async function fetchData(url = '') {
  const response = await fetch(url);
  const verse = await response.json();
  console.log(verse.reference, verse.text);

  return verse;
}

fetchData('https://bible-api.com/james 1:22').then(display);

function display(verse) {
  const h2 = document.querySelector('h2');
  const verseSplit = verse.text.split(' ');
  const chunkedVerse = chunkWithMinSize(verseSplit, 3, 3);
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
    //
    p.classList.add('verse-section');
    p.id = `drag-${index}`;
    p.addEventListener('dragstart', handleDrag);

    p.draggable = 'true';
    return verse;
  });
  buttonEle.addEventListener('click', () => handleClick(verse));
}

function handleClick(verse) {
  const verseCollection = document.getElementsByClassName('droppable');
  console.log(verseCollection);
  const userSubmission = [];
  for (let i = 0; i < verseCollection.length; i++) {
    const firstChild = verseCollection[i].firstChild;
    userSubmission.push(firstChild.textContent);
  }
  console.log(verse.text);
  console.log(userSubmission.join(' '));
  if (userSubmission.join(' ') === verse.text) {
    alert('YEEE BOI!');
    return;
  }
  alert('DAAAANG');
}

//
// const verse =
//   'For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.';
// console.log(verse.split(' '))

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
//! https://www.w3schools.com/html/html5_draganddrop.asp
// check if the user put verse in the correct order by comparing it to the original verse

// const drag = document.getElementById('drag')

function handleDrag(e) {
  e.dataTransfer.setData('text', e.target.id);
  console.log(e);
}

function allowDrop(e) {
  e.preventDefault();
  console.log(e);
}

function handleDrop(e) {
  e.preventDefault();
  console.log(e);
  const data = e.dataTransfer.getData('text');
  console.log(data);
  console.log(e.dataTransfer);
  e.target.appendChild(document.getElementById(data));
}

