// split array into chunks
//! https://www.30secondsofcode.org/js/s/split-array-into-chunks/
export function chunkWithMinSize(arr, chunkSize, minChunkSize = 0) {
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

export function randomVerse(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function loadRandomVerse({ book, chapter, verse } = randomVerse(data)) {
  let query = `${book} ${chapter}:${verse}`;
  // form.classList.toggle('not-active');
  // fetchData(`https://bible-api.com/${query}`).then(display);
  fetchData(`https://bible-api.com/${query}`);
}

//! www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/https:
export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    // create a random number of 1 + 1
    const j = Math.floor(Math.random() * (i + 1));
    // switch the indexes of i and the random index (j)
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function handleDrag(e) {
  e.dataTransfer.setData('text', e.target.id);
}

export function allowDrop(e) {
  e.preventDefault();
}

export function handleDrop(e) {
  e.preventDefault();
  const data = e.dataTransfer.getData('text');
  e.target.append(document.getElementById(data));
}

export function checkVerse(mode, element, arr) {
  if (mode === 'desktop') {
    return arr.forEach((item, i) => {
      return element[i].textContent === item
        ? (element[i].style.backgroundColor = 'lawngreen')
        : (element[i].style.backgroundColor = 'red');
    });
  }

  console.dir(arr);

  return arr.forEach((item, i) => {
    if (
      arr.indexOf(element[i].firstChild.textContent) + 1 ===
      +element[i].children[0].textContent
    ) {
      return (element[i].style.backgroundColor = 'lawngreen');
    }
    return (element[i].style.backgroundColor = 'red');
  });
}

export function setMode() {
  if (window.innerWidth <= 750) {
    mode = 'mobile';
  } else {
    mode = 'desktop';
  }
}
