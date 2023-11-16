import express from 'express'
import { createAvailability, getAvailability, updateAvailability, deleteAvailability } from '../controllers/availability.js'

const router = express.Router()

//This is used to create a new availability for a specific user.
router.post('/:id/availability', createAvailability)

//This is used to retrieve (get) the availabilities of a specific user.
router.get('/:id/availability', getAvailability)

//This is used to update the availabilities of a specific user.
router.put('/:id/availability/:id', updateAvailability)

//This is used to delete a specific availability of a specific user.
router.delete('/:id/availability/:id', deleteAvailability)

export default router
