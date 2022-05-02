const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Express
const app = express();

require('dotenv').config({path:`${__dirname}/config/.env`})

// Middleware pour avoir des info sur la route
app.use(morgan("tiny"));

// Middleware pour le traitement cors
app.use(cors());

// Fix req.body undefined
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

const PORT = process.env.PORT || 3303;

const router = require('./router');
const rootAPI = process.env.ROOT_API;

// Connexion à la db
const db = require('./config/db');

app.use(rootAPI, router);


app.listen(PORT, () => console.log(`started on port ${PORT}`))