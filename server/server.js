import express from 'express';
import cors from 'cors';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { users } from './models/userModel.js';
import mongoose from 'mongoose';

// read json file
//? https://simonplend.com/import-json-in-es-modules/
import json from '../verses.json' assert { type: 'json' };
//? https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
// reads the body
app.use(express.json());
app.use(express.static(join(__dirname, '../')));
app.use(cors());
// got to tell serer to look for the files
// https://expressjs.com/en/starter/static-files.html
// GET
app.get('/', (req, res) => {
  // Home page
  const homePage = join(__dirname, '../index.html');
  res.sendFile(homePage);
});

app.get('/users', async (req, res) => {
  try {
    const allUsers = await users.find({});
    return res.status(200).json({ users: allUsers });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

app.get('/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const currentUser = await users.findOne({ email });
    console.log(email)
    console.log(currentUser);
    return res.status(200).json(currentUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: 'User Not Found' });
  }
});

// POST
app.post('/users', async (req, res) => {
  const userExists = await users.findOne({
    name: req.body.name,
    email: req.body.email,
  });
  try {
    // if user doesn't exist, create a user for them
    // can also make schema unique?
    if (!userExists) {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
      };
      const user = await users.create(newUser);
      return res.status(200).send(user);
    }
    return res.status(500).send({ message: 'that user is already taken' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  // need to specify which db to connect to
  .connect('mongodb://localhost:27017/users')
  .then(() => {
    console.log('Connected to DB');

    app.listen(3000, () => console.log('LISTENING on Port 3000'));
  })
  .catch((err) => console.log(err));
