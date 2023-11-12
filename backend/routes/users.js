import express from 'express';
import { createUser, getUser, getUsers, editUser, deleteUser } from '../controllers/users.js';
//the code for this is in the controller folder

const router = express.Router();

//User Management
//All routes here start with /users
router.post('/', createUser);
router.get('/:id', getUser);
router.get('/', getUsers);
router.put('/:id', editUser);
router.delete('/:id', deleteUser);

export default router;