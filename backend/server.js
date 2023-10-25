import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';
import database from './config/database.js';
// changed the types of the to mode to have newer syntax
const app = express();
const PORT = 5000;


app.use(bodyParser.json());
app.use(express.json());
app.use('/users', usersRoutes);
// app.use('/meeting',);
// app.use('/availability',);
// app.use('/userData', database);


app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

//database
app.get('/api/USERS', async (req, res) => {
    try {
        const [rows] = await database.query("SELECT * FROM users");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send('Server Error');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
