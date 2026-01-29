'use strict';

const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const PORT = 3002;
const HOST = '0.0.0.0';
const app = express();

const DATA_FILE = path.join(__dirname, '/data/messages.json');

let postedMessages = [];

// Load messages on when server starts
async function loadMessages() {
  try {
    const fileData = await fs.readFile(DATA_FILE, 'utf8');
    postedMessages = JSON.parse(fileData);
  } catch (err) {
    // If file doesn't exist or is invalid, start with empty array
    postedMessages = [];
    console.log('No existing messages.');
  }
}

// call function 
loadMessages(); 

app.use(express.json());
app.use('/', express.static('pages'));

// GET all messages
app.get('/messages', (req, res) => {
  res.json({ postedMessages });
});

// POST new message
app.post('/messages', async (req, res) => {
  const text = req.body?.message;

  if (typeof text !== 'string' || text.trim() === '') {
    console.log('Rejected empty message:');
    return res.status(400).json({error: 'Message cannot be empty'});
  }
    const message = {
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    postedMessages.push(message);

    try {
      await fs.writeFile(DATA_FILE, JSON.stringify(postedMessages, null, 2));
    } catch (err) {
      console.error('Failed to write message:', err);
      return res.status(500).json({error: 'Failed to save message'});
    }

  res.json({ postedMessages });
});

app.listen(PORT, HOST, () => {
  console.log(`Running locally on http://${HOST}:${PORT}`);
  console.log(`(If running in Docker, the app is exposed on port 80)`);
});
