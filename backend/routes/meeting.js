import express from 'express'
import { createMeeting, getMeetingDetails, getAllMeetings, updateMeeting, deleteMeeting } from '../controllers/meeting.js'

const router = express.Router()

//This is used to create a meeting.
router.post('/', createMeeting)

//This is used to retrieve (get) the details of a specific meeting.
router.get('/:userId', getMeetingDetails)

//This is used to get the information of all the meetings.
router.get('/', getAllMeetings)

//Updates meeting information. Allows for addition or deletion of participants.
router.put('/:id', updateMeeting)

//Deletes a meeting with specific id number.
router.delete('/:id', deleteMeeting)

export default router
