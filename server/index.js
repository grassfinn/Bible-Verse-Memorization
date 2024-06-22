import express from 'express';
import path, { join } from 'path';
import { fileURLToPath } from 'url';

// read json file
//? https://simonplend.com/import-json-in-es-modules/
import json from '../client/verses.json' assert {type: "json"};
//? https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// TODO add more detail of what should happen for each step

//! APP FLOW
// * optional features
// Visit home page
// User fills in name * and difficulty
// Pull random verse
// user fills out verse and submits
// check if correct
// IF correct, add point
// IF incorrect, have them repeat again

// Leaderboard section: shows top 5 people
// * Different modes
// allow user to search for verse
// allow user to add own verses to randomly select from

const app = express();

//! MiddleWare
// https://expressjs.com/en/starter/static-files.html
// got to tell serer to look for the files
app.use(express.static(join(__dirname, '../client')));

app.get('/', (req, res) => {
  // Home page
  const homePage = join(__dirname, '../client/index.html');
  res.sendFile(homePage);
});

app.listen(3000, () => console.log('LISTENING on Port 3000'));
