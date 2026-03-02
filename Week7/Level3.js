const express = require('express');
//const bodyParser = require('body-parser');

const app = express();
const HOST = '0.0.0.0';
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Posts array
const posts = [
    { id: 1, text: 'bla 1', time: '9:00' },
    { id: 2, text: 'bla, blai 2', time: '9:02' },
    { id: 3, text: 'bla, blai, blai 3', time: '9:05' }
];

// Function to generate hypermedia links
const generatePostLinks = (postId) => {
    return [
        { rel: 'self', href: `http://localhost:${PORT}/posts/${postId}` },
        { rel: 'edit', href: `http://localhost:${PORT}/posts/${postId}`, method: 'PUT' },
        { rel: 'delete', href: `http://localhost:${PORT}/posts/${postId}`, method: 'DELETE' },
        { rel: 'create', href: `http://localhost:${PORT}/posts`, method: 'POST' }
    ];
};

// Get all posts
app.get('/posts', (req, res) => {
    const postsWithLinks = posts.map(post => ({
        ...post,
        links: generatePostLinks(post.id)
    }));

    res.json({ posts: postsWithLinks });
});

// Get a single post by ID
app.get('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ ...post, links: generatePostLinks(postId) });
});

// Create a new post
app.post('/posts', (req, res) => {
  const { text, time } = req.body;

  if (!text || !time) {
      return res.status(400).json({ error: 'Missing text or time' });
  }

  
  const nextId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;

  const newPost = { id: nextId, text, time };
  posts.push(newPost);

  res.status(201).json({ 
      ...newPost, 
      links: generatePostLinks(newPost.id) 
  });
});


// Update a post by ID
app.put('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { text, time } = req.body;
    const index = posts.findIndex((p) => p.id === postId);

    if (index === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    posts[index] = { id: postId, text, time };

    res.json({ ...posts[index], links: generatePostLinks(postId) });
});

// Delete a post by ID 
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const index = posts.findIndex((p) => p.id === postId);

    if (index === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    posts.splice(index, 1);

    res.status(204).send(); 
});

// Start the server
app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
