'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const HOST = '0.0.0.0';
const PORT = 8081;

const DATA_FILE = path.join(__dirname, 'messages.txt');
let postedMessages = [];

// Load messages
if (fs.existsSync(DATA_FILE)) {
  postedMessages = fs
    .readFileSync(DATA_FILE, 'utf8')
    .split('\n')
    .filter(Boolean);
}

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'posting.html'));
});

app.get('/messages', (req, res) => {
  res.json({ postedMessages });
});

app.post('/messages', (req, res) => {
  const message = req.body?.message;
  if (typeof message === 'string' && message.trim()) {
    postedMessages.push(message);
    fs.appendFile(DATA_FILE, message + '\n', () => {});
  }
  res.json({ postedMessages });
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
  });
