import database from '../config/database.js'

//Retrieve available timeslots for scheduling a meeting with one or more users.
export const getAvailableTime = async (req, res) => {
    const { users, duration, date } = req.body
  
    // Ensure that users, duration, and date are provided
    if (!users || !duration || !date) {
      return res.status(400).json({ error: 'Users, duration, and date are required parameters' })
    }

    const query = ' SELECT user_id, start_time, end_time FROM user_availability WHERE user_id IN (?) AND start_time >= ? AND end_time <= ? AND NOT EXISTS ( SELECT 1 FROM meetings WHERE (start_time >= ? AND start_time < ?) OR (end_time > ? AND end_time <= ?))'
  
    // Calculate end time based on duration
    const endTime = new Date(date)
    endTime.setMinutes(endTime.getMinutes() + duration)
  
    // Prepare user IDs for the query
    const userIds = users.map((user) => user.id)
  
    database.query(
      query,
      [userIds, date, endTime, date, endTime, date, endTime],
      (err, results) => {
        if (err) {
          console.log('Error searching for available timeslots:', err)
          res.status(500).json({ error: 'Internal Server Error' })
        } else {
          res.status(200).json(results)
        }
      }
    )
  }
