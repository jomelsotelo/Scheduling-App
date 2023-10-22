const express = require('express');
const app = express();
const PORT = 5000;
const database = require('./database');

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/USERS', async (req, res) => {
    try {
        const [rows] = await database.query("SELECT username FROM user");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send('Server Error');
    }
});cd

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
