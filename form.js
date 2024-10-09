const signInForm = document.getElementById('sign-in-form');
const signIn = document.getElementById('sign-in-btn');
const signUp = document.getElementById('sign-up-btn');
signInForm.addEventListener('submit', submitForm);
let currentUser = localStorage.getItem('user') || null;
let loggedIn = false;

checkLogin();

signIn.addEventListener('click', () => {
  if (!document.querySelector('#sign-up').classList.contains('not-active')) {
    document.querySelector('#sign-up').classList.toggle('not-active');
    document.querySelector('#sign-in').classList.toggle('not-active');
    return;
  }
  document.querySelector('#sign-in').classList.toggle('not-active');
});
signUp.addEventListener('click', () => {
  if (!document.querySelector('#sign-in').classList.contains('not-active')) {
    document.querySelector('#sign-up').classList.toggle('not-active');
    document.querySelector('#sign-in').classList.toggle('not-active');
    return;
  }
  document.querySelector('#sign-up').classList.toggle('not-active');
});

function handleSubmit(e) {
  e.preventDefault();
  book = document.getElementById('book').value;
  chapter = document.getElementById('chapter').value;
  verse = document.getElementById('verse').value;
  let query = `${book} ${chapter}:${verse}`;
  form.classList.toggle('not-active');
  checkButtonEle.classList.toggle('not-active');
  // fetchData(`https://bible-api.com/${query}`).then(display);
}

async function submitForm(e) {
  e.preventDefault();
  const email = document.getElementById('email');
  const username = document.getElementById('name');
  const submitter = e.submitter.id;
  console.log(submitter);
  // Sign Up
  if (submitter === 'create-account') {
    const data = {
      name: username.value.toLowerCase(),
      email: email.value.toLowerCase(),
      score: 0,
    };
    localStorage.setItem('user', data.email);
    // API Call to add email to data base
    const res = await fetch(
      'https://bible-verse-memorization.onrender.com/users',
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'content-type': 'application/json',
        },
        // Need to stringify the data
        body: JSON.stringify(data),
      }
    );
    username.value = '';
    email.value = '';
    const message = await res.json();
  }
  // Login
  if (submitter === 'user-login') {
    const email = document.getElementById('loginEmail');
    localStorage.setItem('user', email);

    await fetch(
      `https://bible-verse-memorization.onrender.com/users/${email.value}`
    )
      // Check status first rather than doing both
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          currentUser = data;
          document.getElementById(
            'user'
          ).textContent = `Welcome back ${data.name}!`;
          document.querySelector('.login').classList.toggle('not-active');
          document.querySelector('.login').classList.remove('open');
          signInForm.remove();
        }
      });
  }
}
export async function incrementScore() {
  await fetch('https://bible-verse-memorization.onrender.com/scores', {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
    },
    // Need to stringify the data
    body: JSON.stringify({ ...currentUser, score: currentUser.score + 1 }),
  });
}

async function logIn(email) {
  await fetch(`https://bible-verse-memorization.onrender.com/users/${email}`)
    // Check status first rather than doing both
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        currentUser = data;
        document.getElementById(
          'user'
        ).textContent = `Welcome back ${data.name}!`;
        document.querySelector('.login').classList.toggle('not-active');
        document.querySelector('.login').classList.remove('open');
        signInForm.remove();
      }
    });
}

function checkLogin() {
  if (!loggedIn) {
    logIn(currentUser);
    loggedIn = true;
    return;
  }
}
