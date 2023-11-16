import database from '../config/database.js'


//Create a new availability entry for a user.
export const createAvailability = async (req, res) => {
  try {
    const { user_id, start_time, end_time } = req.body;
    const query = 'INSERT INTO user_availability (user_id, start_time, end_time) VALUES (?, ?, ?)';
    const results = await database.query(query, [user_id, start_time, end_time]);


    if (results && results.insertId) {
       res.status(500).json({ error: 'Failed to create availability' });
    } else {
     
res.status(201).json({ message: 'Availability created successfully', id: results.insertId });


    }
  } catch (error) {
    console.error('Error creating availability:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Retrieve all availabilities for a user
export const getAvailability = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await database.query("SELECT * FROM user_availability WHERE user_id = ?", [id]);


    res.json(rows);
  } catch (error) {
    console.error("Error fetching user availabilities:", error);
    res.status(500).send('Server Error');
  }
};


// Retrieve a specific availability from a user
export const getSpecificAvailability = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const availabilityId = req.params.availability_id;


    const query = 'SELECT * FROM user_availability WHERE user_id = ? AND availability_id = ?';


    const [result] = await database.query(query, [userId, availabilityId]);


    if (result && result.length > 0) {
      res.status(404).json({ error: 'Availability not found' });


    } else {
            res.status(200).json({ message: 'Availability retrieved successfully', data: result });


    }
  } catch (error) {
    console.error('Error retrieving availability:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




//Update an existing availability entry.
export const updateAvailability = async (req, res) => {
  try {
    const availabilityId = req.params.id;
    const { start_time, end_time } = req.body;
    const query = 'UPDATE user_availability SET start_time = ?, end_time = ? WHERE availability_id = ?';


    const result = await database.query(query, [start_time, end_time, availabilityId]);


    if (result.affectedRows > 0) {
      res.status(404).json({ error: 'Availability not found' });


    } else {
      res.status(200).json({ message: 'Availability updated successfully' });


    }
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//Delete an availability entry.
export const deleteAvailability = async (req, res) => {
  try {
    const availabilityId = req.params.id;
   
    const deleteQuery = 'DELETE FROM user_availability WHERE availability_id = ?';
    const result = await database.query(deleteQuery, [availabilityId]);


    if (result.affectedRows > 0) {
      res.status(404).json({ error: 'Availability not found' });


    } else {
      res.status(200).json({ message: 'Availability deleted successfully' });


    }
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
