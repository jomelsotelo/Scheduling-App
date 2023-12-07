import database from '../config/database.js';

// Retrieve common availability slots for a list of user IDs
export const getAvailableTime = async (req, res) => {
  try {
    const users = req.body;

    // Extract user_ids from the array of user objects and flatten the array
    const userIDs = users.map(user => user.user_ids).flat();
    console.log(userIDs);

    // Ensure userIDs is an array and has at least two elements
    if (!Array.isArray(userIDs) || userIDs.length < 2) {
      res.status(400).json({ error: 'Invalid user IDs provided' });
      return;
    }

    // Generate the SQL statement dynamically with the user IDs
    const sqlStatement = `
      SELECT DISTINCT GREATEST(ua1.start_time, ua2.start_time) AS start_time,
                      LEAST(ua1.end_time, ua2.end_time) AS end_time
      FROM user_availability ua1
      JOIN user_availability ua2 ON ua1.user_id <> ua2.user_id
                               AND ua1.start_time < ua2.end_time
                               AND ua1.end_time > ua2.start_time
      WHERE ua1.user_id IN (${userIDs.join(', ')})
        AND ua2.user_id IN (${userIDs.join(', ')});
    `;

    // Execute the SQL query
    try {
      const [rows] = await database.query(sqlStatement);

      // Send the response based on the result
      if (rows.length === 0) {
        res.status(404).json({ error: 'No common availabilities found' });
      } else {
        // Continue with the remaining logic or send the common availabilities in the response
        res.status(200).json({ commonAvailabilities: rows });
      }
    } catch (error) {
      console.error("Error executing SQL query:", error);
      res.status(500).send('Server Error');
    }
  } catch (error) {
    console.error('Error processing user availabilities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
