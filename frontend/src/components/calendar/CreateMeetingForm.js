import React, { useState, useEffect } from "react";
import Select from "react-select";
import Button from 'react-bootstrap/Button';

const CreateMeetingForm = ({
  onSubmit,
  onCancel,
  userOptions,
  onParticipantsChange,
  selectedMeetingSlot,
}) => {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // No need to set the selected date based on the selected slot
  }, [selectedMeetingSlot]);

  const handleCreateMeeting = () => {
    // Validate the input fields before submitting
    if (!meetingTitle.trim() || selectedParticipants.length === 0 || !selectedMeetingSlot) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    onSubmit({
      title: meetingTitle,
      start: selectedMeetingSlot?.start,
      end: selectedMeetingSlot?.end,
      participants: selectedParticipants,
    });
  };

  const handleParticipantsChange = (selectedOptions) => {
    setSelectedParticipants(selectedOptions);
    onParticipantsChange(selectedOptions); // Call the parent component's function
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '20px' }}>
      <label>Title:</label>
      <input
        type="text"
        value={meetingTitle}
        onChange={(e) => {
          setMeetingTitle(e.target.value);
          setErrorMsg(""); // Clear the error message when the user types
        }}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '15px',
          borderRadius: '5px',
          border: '1px solid #ddd',
          boxSizing: 'border-box',
          fontSize: '16px',
        }}
      />

      <label id="createMeetingParticipantsLabel">Participants:</label>
      <Select
        isMulti
        options={userOptions}
        value={selectedParticipants}
        onChange={handleParticipantsChange}
        styles={{
          control: (provided) => ({
            ...provided,
            marginBottom: '10px',
          }),
        }}
      />

      <div>
        <label>Selected Date:</label>
        <p>
          {selectedMeetingSlot
            ? `${selectedMeetingSlot.start.toLocaleString()} to ${selectedMeetingSlot.end.toLocaleString()}`
            : 'Not Selected'}
        </p>
      </div>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button variant="primary" onClick={handleCreateMeeting}>Confirm Meeting</Button>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default CreateMeetingForm;
