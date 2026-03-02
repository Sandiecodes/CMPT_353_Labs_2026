'use strict';

const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;
const HOST = '0.0.0.0';

// CouchDB connection
const nano = require('nano')('http://admin:admin@couchdb1:5984');
const posts = nano.use('posts');



// Health check

app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});



// List ALL documents

app.get('/test', async (req, res) => {
  try {
    const body = await posts.list({ include_docs: true });
    res.json(body);
  } catch (err) {
    console.error('Error retrieving documents:', err);
    res.status(500).json({ error: 'Failed to retrieve documents' });
  }
});



// Get only user posts
app.get('/getposts', async (req, res) => {
  try {
    const body = await posts.list({ include_docs: true });

    const nonDesignDocs = body.rows
      .filter(row => !row.id.startsWith('_design/'))
      .map(row => row.doc);

    res.json(nonDesignDocs);
  } catch (err) {
    console.error('Error retrieving posts:', err);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});



// Add a new post

app.post('/addposts', async (req, res) => {
  try {
    const { topic, data } = req.body;

    if (!topic || !data) {
      return res.status(400).json({
        error: 'Both topic and data are required'
      });
    }

    const response = await posts.insert({ topic, data });

    res.status(201).json({
      message: 'Post created',
      id: response.id,
      rev: response.rev
    });

  } catch (err) {
    console.error('Error inserting post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});


// Start server

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});