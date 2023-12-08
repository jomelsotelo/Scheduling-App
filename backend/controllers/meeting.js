import database from '../config/database.js'
import dayjs from 'dayjs';

// Create a new meeting
export const createMeeting = async (req, res) => {
  const { title, start_time, end_time, participants } = req.body;

  try {
    // Format the date strings to match the MySQL datetime format
    const formattedStartTime = dayjs(start_time).format('YYYY-MM-DD HH:mm:ss');
    const formattedEndTime = dayjs(end_time).format('YYYY-MM-DD HH:mm:ss');

    // Insert into meetings table
    const meetingQuery = 'INSERT INTO meetings (title, start_time, end_time) VALUES (?, ?, ?)';
    const [meetingResults] = await database.query(meetingQuery, [title, formattedStartTime, formattedEndTime]);

    const meetingId = meetingResults.insertId;

    if (participants && participants.length > 0) {
      // Insert into meeting_participants table
      const participantsQuery = 'INSERT INTO meeting_participants (meeting_id, user_id) VALUES ?';
      const participantsValues = participants.map((participantId) => [meetingId, participantId]);

      await database.query(participantsQuery, [participantsValues]);
    }

    res.status(201).json({ message: 'Meeting created successfully', id: meetingId });
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getMeetingDetails = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Retrieve meeting details for a specific user from the meeting_participants table
    const [meetingResults] = await database.query(`
      SELECT
        meetings.*,
        users.user_id as participant_user_id,
        users.first_name as participant_first_name,
        users.last_name as participant_last_name,
        users.email as participant_email
      FROM
        meetings
      JOIN
        meeting_participants ON meetings.meeting_id = meeting_participants.meeting_id
      JOIN
        users ON meeting_participants.user_id = users.user_id
      WHERE
        meetings.meeting_id IN (
          SELECT meeting_id
          FROM meeting_participants
          WHERE user_id = ?
        );
    `, [userId]);

    if (meetingResults.length === 0) {
      return res.status(404).json({ error: 'No meetings found for the user' });
    }

    // Group participants by meeting_id
    const meetingsMap = new Map();
    meetingResults.forEach((meeting) => {
      const meetingId = meeting.meeting_id;

      if (!meetingsMap.has(meetingId)) {
        // Initialize the meeting entry
        meetingsMap.set(meetingId, {
          meeting_id: meeting.meeting_id,
          title: meeting.title,
          start_time: meeting.start_time,
          end_time: meeting.end_time,
          participants: [],
        });
      }

      // Add participant details to the meeting
      meetingsMap.get(meetingId).participants.push({
        user_id: meeting.participant_user_id,
        first_name: meeting.participant_first_name,
        last_name: meeting.participant_last_name,
        email: meeting.participant_email,
      });
    });

    // Convert the map values to an array
    const meetingsData = Array.from(meetingsMap.values());

    res.status(200).json(meetingsData);
  } catch (error) {
    console.error('Error retrieving meetings for user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





// Get all meetings
export const getAllMeetings = async (req, res) => {
  try {
    const query = 'SELECT * FROM meetings';
    const [rows] = await database.query(query);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving meetings:', error);
    res.status(500).json({ error: 'Failed to retrieve meetings from the database.' });
  }
};

// Update an existing meeting (Add or remove participants)
export const updateMeeting = async (req, res) => {
  const meetingId = req.params.id;
  const { addParticipants, removeParticipants } = req.body;

  try {
    if (addParticipants && addParticipants.length > 0) {
      const addParticipantsQuery = 'INSERT INTO meeting_participants (meeting_id, user_id) VALUES ?';
      const addParticipantsValues = addParticipants.map((participantId) => [meetingId, participantId]);

      await database.query(addParticipantsQuery, [addParticipantsValues]);
    }

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

// Delete a meeting
export const deleteMeeting = async (req, res) => {
  const meetingId = req.params.id;
  const deleteMeetingQuery = 'DELETE FROM meetings WHERE meeting_id = ?';
  const deleteParticipantsQuery = 'DELETE FROM meeting_participants WHERE meeting_id = ?';

  try {
    await database.query(deleteMeetingQuery, [meetingId]);

    // Also delete participants associated with the meeting
    await database.query(deleteParticipantsQuery, [meetingId]);

    res.status(200).json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    console.error('Error deleting meeting or participants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
