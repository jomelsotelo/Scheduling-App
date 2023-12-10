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
  const [selectedParticipants, setSelectedParticipants] = useState([]); // Initialize with the current user
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
    <div>
      <label>Title:</label>
      <input
        type="text"
        value={meetingTitle}
        onChange={(e) => {
          setMeetingTitle(e.target.value);
          setErrorMsg(""); // Clear the error message when the user types
        }}
      />

      <label>Participants:</label>
      <Select
        isMulti
        options={userOptions}
        value={selectedParticipants}
        onChange={handleParticipantsChange}
      />

      {selectedMeetingSlot && (
        <div>
          <label>Selected Date:</label>
          <p>
            {selectedMeetingSlot.start.toLocaleString()} to{" "}
            {selectedMeetingSlot.end.toLocaleString()}
          </p>
        </div>
      )}

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <Button class="Calendar" variant="primary" onClick={handleCreateMeeting}>Confirm Meeting</Button>
      <Button class="Calendar" variant="primary" onClick={onCancel}>Cancel</Button>
    </div>
  );
};

export default CreateMeetingForm;
