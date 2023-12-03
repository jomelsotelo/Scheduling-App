import express from 'express'
 import {deleteNotification, getNotifications,createInvite} from '../controllers/extra.js'
  
const router = express.Router()
router.post('/invite', createInvite )
router.get('/notifications/:user_id', getNotifications )
router.delete('/notifications/:notification_Id', deleteNotification)

export default router
