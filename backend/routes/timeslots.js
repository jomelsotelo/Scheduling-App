import express from 'express'
import { getAvailableTime } from '../controllers/timeslots.js'

const router = express.Router()
router.get('/', getAvailableTime)

export default router