import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const CreateMeetingForm = ({
  onSubmit,
  onCancel,
  userOptions,
  onParticipantsChange,
  selectedMeetingSlot,
}) => {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  useEffect(() => {
    // No need to set the selected date based on the selected slot
  }, [selectedMeetingSlot]);

  // Fetch available meeting times based on selected participants
  const fetchAvailableTimes = async () => {
    try {
      // Prepare data for API request
      const requestData = {
        users: selectedParticipants.map((participant) => ({
          id: participant.value,
        })),
        // Remove duration and date from the request
      };

      // Call your API endpoint to get available timeslots
      const response = await axios.post("/api/timeslots", requestData);
      const availableTimeslots = response.data;

      // Call the callback to update the parent component's state (calendar events)
      onParticipantsChange(selectedParticipants, availableTimeslots);
    } catch (error) {
      console.error("Error fetching available meeting times:", error);
    }
  };

  const handleCreateMeeting = () => {
    onSubmit({
      title: meetingTitle,
      participants: selectedParticipants,
      start: selectedMeetingSlot?.start,
      end: selectedMeetingSlot?.end,
    });
  };

  const handleParticipantsChange = (selectedOptions) => {
    setSelectedParticipants(selectedOptions);
    fetchAvailableTimes(); // Fetch available meeting times when participants change
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

      <button onClick={handleCreateMeeting}>Confirm Meeting</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default CreateMeetingForm;
