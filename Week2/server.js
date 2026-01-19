'use strict';

const express = require('express');

// Constants
const PORT = process.env.PORT || 8080;
// Use localhost for windows
const HOST = '0.0.0.0'; 


// App
const app = express();
app.get('/welcome', (req, res) => {
  res.send('Welcome to CMPT 353 Tutorials');
});

app.get('/hello', (req, resp) => { console.log(req.originalUrl); resp.send('hello world'); });

app.use('/', express.static('pages'));

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

