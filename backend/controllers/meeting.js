import database from '../config/database.js'


//Create a new meeting.
export const createMeeting = async (req, res) => {
    const { title, scheduled_time, duration, participants } = req.body
    const meetingQuery = 'INSERT INTO meetings (title, scheduled_time, duration) VALUES (?, ?, ?)'
   
    database.query(meetingQuery, [title, scheduled_time, duration], (err, results) => {
      if (err) {
        console.log('Error creating meeting:', err)
        res.status(500).json({ error: 'Internal Server Error' })
      } else {
        const meetingId = results.insertId;
        const participantsQuery = 'INSERT INTO meeting_participants (meeting_id, user_id) VALUES ?'
        const participantsValues = participants.map((participantId) => [meetingId, participantId])
 
        database.query(participantsQuery, [participantsValues], (err) => {
          if (err) {
            console.log('Error adding participants:', err)
            res.status(500).json({ error: 'Internal Server Error' })
          } else {
            res.status(201).json({ message: 'Meeting created successfully', id: meetingId })
          }
        })
      }
    })
  }
 
//Retrieve details about a specific meeting.
export const getMeetingDetails = async (req, res) => {
  const meetingId = req.params.id;


  try {
    const [results] = await database.query('SELECT * FROM meetings WHERE meeting_id = ?', [meetingId]);


    if (results.length === 0) {
      // Meeting with the specified ID not found
      res.status(404).json({ error: 'Meeting not found' });
    } else {
      // Return the details of the meeting
      res.status(200).json(results[0]);
    }
  } catch (error) {
    console.error('Error retrieving meeting details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//Get all meetings
export const getAllMeetings = async (req, res) => {
  try {
    const query = 'SELECT * FROM meetings';


    // Use the connection pool to get a connection and execute the query
    const [rows, fields] = await database.query(query);
    // Send the results as JSON
    res.status(200).json(rows);
  } catch (error) {
    // Log the error for debugging
    console.error('Error retrieving meetings:', error);


    // Send an error response with a more specific message
    res.status(500).json({ error: 'Failed to retrieve meetings from the database.' });
  }
};




//Update an existing meeting(Add or remove participants).
export const updateMeeting = async (req, res) => {
  const meetingId = req.params.id;
  const { addParticipants, removeParticipants } = req.body;


  try {
    // Check if there are participants to add
    if (addParticipants && addParticipants.length > 0) {
      const addParticipantsQuery = 'INSERT INTO meeting_participants (meeting_id, user_id) VALUES ?';
      const addParticipantsValues = addParticipants.map((participantId) => [meetingId, participantId]);


      await database.query(addParticipantsQuery, [addParticipantsValues]);
    }


    // Check if there are participants to remove
    if (removeParticipants && removeParticipants.length > 0) {
      const removeParticipantsQuery = 'DELETE FROM meeting_participants WHERE meeting_id = ? AND user_id IN (?)';
      await database.query(removeParticipantsQuery, [meetingId, removeParticipants]);
    }


    res.status(200).json({ message: 'Meeting updated successfully' });
  } catch (error) {
    console.error('Error updating meeting:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//Delete a meeting.
export const deleteMeeting = async(req, res) => {
    const meetingId = req.params.id
    const deleteMeetingQuery = 'DELETE FROM meetings WHERE meeting_id = ?'
    const deleteParticipantsQuery = 'DELETE FROM meeting_participants WHERE meeting_id = ?'
 
    database.query(deleteMeetingQuery, [meetingId], (err) => {
      if (err) {
        console.log('Error deleting meeting:', err)
        res.status(500).json({ error: 'Internal Server Error' })
      } else {
        // Also delete participants associated with the meeting
        database.query(deleteParticipantsQuery, [meetingId], (err) => {
          if (err) {
            console.log('Error deleting participants:', err)
            res.status(500).json({ error: 'Internal Server Error' })
          } else {
            res.status(200).json({ message: 'Meeting deleted successfully' })
          }
        })
      }
    })
  }
