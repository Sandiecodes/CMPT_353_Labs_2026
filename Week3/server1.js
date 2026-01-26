'use strict';

// load package
const express = require('express');


const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();

const postedMessages = [];

app.use(express.json());

 

 
app.get('/greeting', (req,res) => {
        
         res.send('hello ');
   });

app.post('/messages', (req, res) => {
  const message = req.body?.message;
  if (typeof message === 'string') {
    postedMessages.push(message);
  }
  res.json({ postedMessages });
});

// GET all messages
app.get('/messages', (req, res) => {
  res.json({ postedMessages });
});
 app.use('/', express.static('pages'));

   

//Listen on port
app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
  });
