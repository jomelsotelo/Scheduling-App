import express from 'express';
import { registerUser, authenticateUser } from '../controllers/auth.js';

const authRoutes = express.Router();

//User Registration and Authentication
authRoutes.post('/register', registerUser);
authRoutes.post('/login', authenticateUser);

export default authRoutes;