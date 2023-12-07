import express from 'express'
import { getAvailableTime } from '../controllers/timeslots.js'

const router = express.Router()
router.get('/:user_ids', getAvailableTime)

export default router