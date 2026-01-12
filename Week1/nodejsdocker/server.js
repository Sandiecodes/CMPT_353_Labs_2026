'use strict';

const express = require('express');

// Constants
const PORT = process.env.PORT || 3002;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/welcome', (req, res) => {
  res.send('Welcome to CMPT 353 Tutorials');
});

app.get('/', (req, resp) => { console.log(req.originalUrl); resp.send('hello world'); });
app.get('/hello', (req, resp) => { console.log(req.originalUrl); resp.send('hello'); });

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});