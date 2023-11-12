import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js'
// changed the types of the to mode to have newer syntax
const app = express();
const PORT = 5000;


app.use(bodyParser.json());
app.use(express.json());
app.use('/users', usersRoutes);
app.use('/auth', authRoutes)
// app.use('/meeting',);
// app.use('/availability',);
// app.use('/userData', database);


app.get('/hello', (req, res) => {
    res.send('Hello World!');
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
