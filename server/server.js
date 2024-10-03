import express from 'express';
import cors from 'cors';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { Users } from './models/userModel.js';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
// read json file
//? https://simonplend.com/import-json-in-es-modules/
// import json from '../verses.json' assert { type: 'json' };
//? https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//! MiddleWare
// reads the body
app.use(express.json());
//Sending Files via serverside Server
// app.use(express.static(join(__dirname, '../')));

app.use(cors());
// app.use(
//   cors({
//     origin: 'http://localhost:5500',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//   })
// );
// got to tell serer to look for the files
// https://expressjs.com/en/starter/static-files.html
//! GET
app.get('/', (req, res) => {
  res.send(<h1>Hello</h1>)
});

app.get('/users', async (req, res) => {
  try {
    const allUsers = await Users.find({});
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

app.get('/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const currentUser = await Users.findOne({ email });
    return res.status(200).json(currentUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: 'User Not Found' });
  }
});
// $gt Query status
//! POST
app.post('/users', async (req, res) => {
  try {
    // if user doesn't exist, create a user for them
    // can also make schema unique?
    const userExists = await Users.findOne({
      email: req.body.email,
    });
    if (!userExists) {
      const newUser = req.body;
      const user = await Users.create(newUser);

      return res.status(200).send(user);
    }
    return res.status(500).send({ message: 'that user is already taken' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ! PUT
app.put('/scores', async (req, res) => {
  const updatedUser = await Users.findByIdAndUpdate(req.body._id, req.body);
  res.status(200).json(updatedUser);
});

mongoose.connect(process.env.ATLAS_URI).then(() => {
  app.listen(3000, () => console.log('LISTENING on Port 3000'));
});
