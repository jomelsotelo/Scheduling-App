import React, { useState} from 'react'
import EnhancedTable from './UserTable'

const CreateMeetingForm = ({ onSubmit, onCancel, userOptions, onTitleChange, onParticipantsChange, onDurationChange }) => {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(60); // Default duration in minutes
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default date is today

  const handleCreateMeeting = () => {
    onSubmit({
      title: meetingTitle,
      participants: selectedParticipants,
      duration: selectedDuration,
      date: selectedDate,
    });
  };

  return (
    <div>
      <label>Title:</label>
      <input
        type="text"
        value={meetingTitle}
        onChange={(e) => setMeetingTitle(e.target.value)}
      />

      <label>Participants:</label>
      <EnhancedTable />

      <label>Meeting Duration (minutes):</label>
      <input
        type="number"
        value={selectedDuration}
        onChange={(e) => setSelectedDuration(e.target.value)}
      />

      <label>Selected Date:</label>
      <input
        type="datetime-local"
        value={selectedDate.toISOString().slice(0, -8)} // Format the date for input field
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      />

      <button onClick={handleCreateMeeting}>Create Meeting</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default CreateMeetingForm;
