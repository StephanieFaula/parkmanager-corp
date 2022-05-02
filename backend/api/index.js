const express = require('express');
const morgan = require('morgan');

// Express
const app = express();

require('dotenv').config({path:`${__dirname}/config/.env`})

const PORT = process.env.PORT || 3303;


// Middleware pour avoir des info sur la route
app.use(morgan("tiny"));

// Connexion à la db
const db = require('./config/db');


app.listen(PORT, () => console.log(`started on port ${PORT}`))