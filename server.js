'use strict'
/* Global Varibles */
const port = 80;

// Object for storing data
let projectData = {};

// Setting Express
const express = require('express');
const app = express();

// Serving static files using Express
app.use(express.static('website'));

/* Middleware*/

// Cors
const cors = require('cors');
app.use(cors());
// body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Receive data
app.post('/data', (req, res) => {
    Object.assign(projectData, req.body);
    res.send()
})

// Return data
app.get('/returnData', (req, res) => {
    res.send(projectData)
})

// Setup Server

app.listen(port, () => {
    console.log('Server is running on port', port)
})