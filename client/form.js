const signInForm = document.getElementById('sign-in-form');
const signIn = document.getElementById('sign-in');
const signUp = document.getElementById('sign-up');
signInForm.addEventListener('submit', submitForm);
let currentUser;

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
    console.log('submitted!')
    const email = document.getElementById('email');
    const username = document.getElementById('name');
    const submitter = e.submitter.id;
    console.log(submitter);
    // Sign Up
    if (submitter === 'create-account') {
        const data = {
            name: username.value.toLowerCase(),
            email: email.value.toLowerCase(),
            score: 0
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
        username.value = ''
        email.value = ''
        const message = await res.json();
        console.log(message);
    }
    // Login
    if (submitter === 'user-login') {
        const email = document.getElementById('loginEmail');
        await fetch(`http://localhost:3000/users/${email.value}`)
            // Check status first rather than doing both
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    currentUser = data
                    console.log(currentUser);
                    document.getElementById(
                        'user'
                    ).textContent = `Welcome back ${data.name}!`;
                    document.querySelector('.login').classList.toggle('not-active')
                    document.querySelector('.login').classList.remove('open')
                    signInForm.remove()
                }
            });
    }
}
export async function incrementScore() {
    await fetch('http://localhost:3000/scores', {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'content-type': 'application/json',
        },
        // Need to stringify the data
        body: JSON.stringify({ ...currentUser, score: currentUser.score + 1 }),
    })
}