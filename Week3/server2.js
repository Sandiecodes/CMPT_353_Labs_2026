'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = 3002;
const HOST = '0.0.0.0';
const app = express();

const DATA_FILE = path.join(__dirname, '/pages/messages.txt');

let postedMessages = [];

// Load messages on startup
if (fs.existsSync(DATA_FILE)) {
  const fileData = fs.readFileSync(DATA_FILE, 'utf8');
  postedMessages = fileData
    .split('\n')
    .filter(line => line.trim() !== '');
}

app.use(express.json());
app.use('/', express.static('pages'));

// GET all messages
app.get('/messages', (req, res) => {
  res.json({ postedMessages });
});

// POST new message
app.post('/messages', (req, res) => {
  const message = req.body?.message;

  if (typeof message === 'string' && message.trim() !== '') {
    postedMessages.push(message);

    // Append message to file
    fs.appendFile(DATA_FILE, message + '\n', err => {
      if (err) {
        console.error('Failed to write message:', err);
      }
    });
  }

  res.json({ postedMessages });
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
