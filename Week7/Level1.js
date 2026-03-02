const express = require('express');
//const bodyParser = require('body-parser');

const app = express();
const HOST = '0.0.0.0';
const PORT= 3000;

app.use( express.json());
app.use(express.urlencoded({ extended: true }));

// Posts
const posts= [
    { id: 1, text: 'bla 1', time: '9:00'},
    { id: 2, text: 'bla, blai 2', time: '9:02'} ,
    { id: 3, text: 'bla, blai, blai 3', time: '9:05'} 
];

// Get all posts
app.get('/posts', (req, res) => {
    res.send(posts);
  });

 // Route to get a post by id
app.get('/posts/:id', (req, res) => {
    const postId = req.params.id;
    const post = posts.find(p => p.id === parseInt(postId));
    if (!post) {
        res.status(404).send('The post with the given ID was not found.');
    } else {
        res.send(post);
    }
  }); 

// Start the server  
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);



