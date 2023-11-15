import express from 'express'
import { createAvailability, getAvailability, updateAvailability, deleteAvailability } from '../controllers/availability.js'

const router = express.Router()
router.post('/:id/availability', createAvailability)
router.get('/:id/availability', getAvailability)
router.put('/:id/availability/:id', updateAvailability)
router.delete('/:id/availability/:id', deleteAvailability)

export default router