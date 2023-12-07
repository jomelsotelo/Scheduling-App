import database from '../config/database.js';

// Retrieve common availability slots for a list of user IDs
export const getAvailableTime = async (req, res) => {
  try {
    const users = req.params;
    console.log(users);
    
    // Parse the user_ids string into an array
    const userIDs = JSON.parse(users.user_ids);
        console.log(userIDs);


    // Generate the SQL statement dynamically with the user IDs
    const sqlStatement = `
      SELECT GREATEST(ua1.start_time, ua2.start_time) AS start_time,
             LEAST(ua1.end_time, ua2.end_time) AS end_time
      FROM user_availability ua1
      JOIN user_availability ua2 ON ua1.user_id <> ua2.user_id
                               AND ua1.start_time < ua2.end_time
                               AND ua1.end_time > ua2.start_time
      WHERE ua1.user_id IN (${userIDs.join(', ')})
        AND ua2.user_id IN (${userIDs.join(', ')})
      GROUP BY start_time, end_time
      HAVING COUNT(DISTINCT ua1.user_id) = ${userIDs.length};
    `;

    // Execute the SQL query
    try {
      const [rows] = await database.query(sqlStatement);

      // Send the response based on the result
      if (rows.length === 0) {
        res.status(404).json({ error: 'No common availabilities found' });
      } else {
        // Continue with the remaining logic or send the common availabilities in the response
        res.status(200).json(rows );
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
