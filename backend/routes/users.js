import express from 'express';
import { getUsers, createUser, getUser, deleteUser, updateUser } from '../controllers/users.js';
//the code for this is in the controller folder


const router = express.Router();


//All routes here start with /users
router.get('/', getUsers);


router.post('/', createUser);


router.get('/:id', getUser);


router.delete('/:id', deleteUser);


router.put('/:id', updateUser);


export default router;