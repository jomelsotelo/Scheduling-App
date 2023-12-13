import database from '../config/database.js';

export const createInvite = async (req, res) => {
  
  const {meeting_id, user_id} = req.body;

  try {
    if (!meeting_id || !user_id) {
      return res.status(400).send('All required fields must be provided.');
    }
 

    // Check if there are participants to invite
    const inviteParticipantsQuery = 'INSERT INTO meeting_invite (meeting_id, user_id) VALUES (?, ?)';
    const values = [meeting_id, user_id];
    const result = await database.query(inviteParticipantsQuery, values);

    if (result.affectedRows === 0) {
      res.status(500).send('Failed to create an invitation.');
    } else {

      // Create a notification associated with the user
      const createNotificationQuery = `
        INSERT INTO notifications (type, content, user_id, entityId)
        VALUES (?, ?, ?, ?, ?)`;
      const notificationValues = ['meeting_invitation', 'You\'ve been invited to a meeting.', user_id, meeting_id];

      await database.query(createNotificationQuery, notificationValues);

      res.send(`User with ID ${user_id} added to meeting ${meeting_id}, and notification created.`);
    }
  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).send('Server Error');
  }
};

export const getNotifications = async (req, res) => {
  const user = req.params.user_id;

  try {
    // Retrieve notifications associated with the user
    const getNotificationsQuery = 'SELECT * FROM notifications WHERE user_id = ?';
    const [notifications] = await database.query(getNotificationsQuery, user);
console.log(user)
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    res.status(500).send('Server Error');
  }
};


export const deleteNotification = async (req, res) => {
  const notificationId = req.params.notification_Id;

  try {
    // Validate input
    if (!notificationId ) {
      return res.status(400).send('Invalid notification ID.');
    }


    // Delete notification
    const deleteNotificationQuery = 'DELETE FROM notifications WHERE notifications_id = ?';
    const deleteResult= await database.query(deleteNotificationQuery, notificationId);

    if (deleteResult.affectedRows === 0) {
      return res.status(404).send('Notification not found.');
    }

    res.status(204).send(`notification deleted`); // 204 No Content for successful deletion
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).send('Server Error');
  }
};

export const sendNotification = async (req, res) => {
  const { type, entityId, content, user_id } = req.body;

  try {
    // Validate input
    if (!type || !entityId || !content || !user_id) {
      return res.status(400).send('All required fields must be provided.');
    }

    // Insert notification into the database
    const sendNotificationQuery = `
      INSERT INTO notifications (type, entityId, content, user_id)
      VALUES (?, ?, ?, ?)`;
    const notificationValues = [type, entityId, content, user_id];

    const result = await database.query(sendNotificationQuery, notificationValues);

    if (result.affectedRows === 0) {
      return res.status(500).send('Failed to send the notification.');
    }

    res.status(201).json({ message: 'Notification sent successfully.' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send('Server Error');
  }
};