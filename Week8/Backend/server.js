const express = require('express');
const bodyParser = require('body-parser');
const nano = require('nano');
const cors = require('cors');

const app = express();


app.use(cors());
app.use( bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 8080;
const HOST = '0.0.0.0';

//Set up the connection to the CouchDB server
//Environment variables
// --- Environment Variables ---
const COUCHDB_URL = process.env.COUCHDB_URL || 'http://admin:password@couchdb:5984';
const COUCHDB_DB = process.env.COUCHDB_DB || 'questionsdb';

//Create a new instance of nano with the CouchDB URL
const couch = nano(COUCHDB_URL);

//Ensure that the database exists or create it
(async () => {
    try {
    const dbList = await couch.db.list();
    if (!dbList.includes(COUCHDB_DB)) {
    await couch.db.create(COUCHDB_DB);
    console.log(`Database ${COUCHDB_DB} created.`);
    } else {
    console.log(`Database ${COUCHDB_DB} already exists.`);
    }
    } catch (err) {
    console.error('Error creating/checking DB:', err);
    }
    })();

//Select the database to use
const questionsDB = couch.db.use(COUCHDB_DB);  

//Post data to the database
app.post('/questions', async (req, res) => {
    const { question, response } = req.body;
    if (!question || !response) {
    return res.status(400).json({ error: 'Both question and response are required' });
    }
    try {
    const doc = await questionsDB.insert({ question, response });
    res.status(200).json({ message: 'Question inserted', id: doc.id });
    } catch (err) {
    console.error('Error inserting document:', err);
    res.status(500).json({ error: 'Failed to insert question' });
    }
    });

//Get all questions from the database
app.get('/questions', async (req, res) => {
    try {
    // Using Mango query or _all_docs approach:
    const result = await questionsDB.list({ include_docs: true });
    const allDocs = result.rows.map((row) => ({
    id: row.id,
    question: row.doc.question,
    response: row.doc.response
    }));
    res.status(200).json(allDocs);
    } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).json({ error: 'Failed to fetch questions' });
    }
    });

    app.listen(PORT, HOST);
    console.log(`Running on http://${HOST}:${PORT}`);    