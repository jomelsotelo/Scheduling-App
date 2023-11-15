import database from '../config/database.js'

//Create a new availability entry for a user.
export const createAvailability = async (req, res) => {
    const { user_id, start_time, end_time } = req.body
    const query = 'INSERT INTO user_availability (user_id, start_time, end_time) VALUES (?, ?, ?)'
    database.query(query, [user_id, start_time, end_time], (err, results) => {
      if (err) {
        console.log('Error creating availability:', err)
        res.status(500).json({ error: 'Internal Server Error' })
      } else {
        res.status(201).json({ message: 'Availability created successfully', id: results.insertId })
      }
    })
  }
//Retrieve all availabilities for a user.
export const getAvailability = async (req, res) => {
    const userId = req.params.user_id
    const query = 'SELECT * FROM user_availability WHERE user_id = ?'
    database.query(query, [userId], (err, results) => {
      if (err) {
        console.log('Error retrieving availabilities:', err)
        res.status(500).json({ error: 'Internal Server Error' })
      } else {
        res.status(200).json(results)
      }
    })
  }

//Update an existing availability entry.
export const updateAvailability = async (req, res) => {
    const availabilityId = req.params.id
    const { start_time, end_time } = req.body
    const query = 'UPDATE user_availability SET start_time = ?, end_time = ? WHERE id = ?'
    database.query(query, [start_time, end_time, availabilityId], (err) => {
      if (err) {
        console.log('Error updating availability:', err)
        res.status(500).json({ error: 'Internal Server Error' })
      } else {
        res.status(200).json({ message: 'Availability updated successfully' })
      }
    })
  }

//Delete an availability entry.
export const deleteAvailability = async (req, res) => {
    const availabilityId = req.params.id
    const query = 'DELETE FROM user_availability WHERE id = ?'
    database.query(query, [availabilityId], (err) => {
      if (err) {
        console.log('Error deleting availability:', err)
        res.status(500).json({ error: 'Internal Server Error' })
      } else {
        res.status(200).json({ message: 'Availability deleted successfully' })
      }
    })
  }