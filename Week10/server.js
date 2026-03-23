const express = require('express');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(sessions({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));


//File path
const USERS_FILE = './users.json';


//Helper: read users
function getUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
}


//Helper: save users
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}


//REGISTER
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username and password required");
    }

    const users = getUsers();

    const exists = users.find(u => u.username === username);
    if (exists) {
        return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        username,
        password: hashedPassword
    });

    saveUsers(users);

    res.send("User registered successfully");
});


//LOGIN
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const users = getUsers();

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).send("Invalid credentials");
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
        req.session.user = username;
        return res.send("Login successful");
    }

    res.status(401).send("Invalid credentials");
});


//PROTECTED ROUTE
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        return res.send(`Welcome ${req.session.user}`);
    }
    res.status(401).send("Please login first");
});


//GET CURRENT USER
app.get('/me', (req, res) => {
    if (req.session.user) {
        return res.json({ user: req.session.user });
    }
    res.status(401).send("Not logged in");
});


//LOGOUT
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send("Logged out");
    });
});


//HOME
app.get('/', (req, res) => {
    res.send("Auth server running");
});

app.use('/', express.static('pages'));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});