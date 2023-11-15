import express from 'express'
import { createUser, getUser, getUsers, editUser, deleteUser } from '../controllers/users.js'

const router = express.Router()
router.post('/', createUser)
router.get('/:id', getUser)
router.get('/', getUsers)
router.put('/:id', editUser)
router.delete('/:id', deleteUser)

export default router