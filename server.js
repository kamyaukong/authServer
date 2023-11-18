const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware for parsing JSON bodies
app.use(cors());
app.use(bodyParser.json());

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // TODO: Simulate authentication for prototyping
    // add DB comparsion routine to check username+password
    const isAuthenticated = true; 

    if (isAuthenticated) {
        // Create JWT token
        const token = jwt.sign({ username }, 'COMP229', { expiresIn: '5m' });
        res.json({ token });
    } else {
        res.status(401).send('Authentication failed');
    }
});

// Middleware to verify token
// Function to be used by every router to protected like /content below
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, 'COMP229', (err, authData) => {
            if (err) {
                res.sendStatus(403); // Forbidden
            } else {
                next();
            }
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};


// Protected Route
app.get('/content', verifyToken, (req, res) => {
    res.json({ content: 'Protected Content' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
