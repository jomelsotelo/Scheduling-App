import express from 'express'
import { createMeeting, getMeetingDetails, getAllMeetings, updateMeeting, deleteMeeting } from '../controllers/meeting.js'

const router = express.Router()
router.post('/', createMeeting)
router.get('/:id', getMeetingDetails)
router.get('/', getAllMeetings)
router.put('/:id', updateMeeting)
router.delete('/:id', deleteMeeting)

export default router