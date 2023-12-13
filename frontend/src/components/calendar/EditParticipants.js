import React, { useState } from 'react';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const EditParticipantsButton = ({
  userOptions,
  selectedParticipants,
  onChange,
  meetingId,
  meetingDetails, // Pass meetingDetails as a prop
}) => {
  const [openSelect, setOpenSelect] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', or empty for default

  const handleToggleSelect = () => {
    setOpenSelect((prevOpenSelect) => !prevOpenSelect);
    setMessage('');
  };

  const handleSelectChange = (selectedOptions) => {
    onChange(selectedOptions);
    setMessage('');
  };

  const handleAddParticipants = async () => {
    try {
      const participantsToAdd = selectedParticipants
        .filter((participant) => !participant.existing)
        .map((participant) => participant.value);

      // Check if participantsToAdd already exist in the meeting
      const participantsInMeeting = meetingDetails.participants.map(
        (participant) => participant.user_id
      );

      const newParticipantsToAdd = participantsToAdd.filter(
        (participant) => !participantsInMeeting.includes(participant)
      );

      if (newParticipantsToAdd.length === 0) {
        // Display an error message if all selected participants are already in the meeting
        setMessageType('error');
        setMessage('The following participants are already in the meeting.');
      } else {
        // Make the API call only if there are new participants to add
        await axios.put(`/api/meeting/${meetingId}`, {
          addParticipants: newParticipantsToAdd,
          removeParticipants: [], // Empty array for removeParticipants
        });

        // Check if any participants were added
        const addedParticipants = participantsToAdd.filter(
          (participant) => !participantsInMeeting.includes(participant)
        );

        if (addedParticipants.length > 0) {
          // Display a success message if new participants were added
          setMessageType('success');
          setMessage(`Participants added successfully: ${addedParticipants.join(', ')}`);
        } else {
          // Display a message indicating that no new participants were added
          setMessageType('info'); // Use 'info' for neutral messages
          setMessage('No new participants selected for addition.');
        }
      }
    } catch (error) {
      console.error('Error adding meeting participants:', error);
      setMessageType('error');
      setMessage('Error adding participants. Please try again.');
    }
  };

  const handleRemoveParticipants = async () => {
    try {
      // Get user IDs of participants to remove
      const participantsToRemove = selectedParticipants
        .filter((participant) => !participant.existing)
        .map((participant) => participant.value);

      // Check if there are participants to remove
      if (participantsToRemove.length > 0) {
        // Only remove participants who are currently part of the meeting
        const participantsInMeeting = meetingDetails.participants.map(
          (participant) => participant.user_id
        );

        // Filter out participants that are not in the meeting anymore
        const validParticipantsToRemove = participantsToRemove.filter(
          (participant) => participantsInMeeting.includes(participant)
        );

        if (validParticipantsToRemove.length > 0) {
          // Make the API call only if there are valid participants to remove
          await axios.put(`/api/meeting/${meetingId}`, {
            addParticipants: [], // Empty array for addParticipants
            removeParticipants: validParticipantsToRemove,
          });

          // setOpenSelect(false);
          setMessageType('success');
          setMessage('Participants removed successfully.');
        }

        // Check if any participants were removed
        const removedParticipants = participantsToRemove.filter(
          (participant) => !participantsInMeeting.includes(participant)
        );

        if (removedParticipants.length > 0) {
          // Handle the case where some participants were already removed
          setMessageType('info');
          setMessage(
            `The following participants are no longer in the meeting: ${removedParticipants.join(', ')}`
          );
        } else if (validParticipantsToRemove.length === 0) {
          setMessageType('info');
          setMessage('No participants selected for removal.');
        }
      } else {
        setMessageType('info');
        setMessage('No participants selected for removal.');
      }
    } catch (error) {
      console.error('Error removing meeting participants:', error);
      setMessageType('error');
      setMessage('Error removing participants. Please try again.');
    }
  };

  const handleCancel = () => {
    setOpenSelect(false);
    setMessage('');
  };

  return (
    <div>
      <Button variant="light button-top" onClick={handleToggleSelect}>
        Edit Participants
      </Button>
      {openSelect && (
        <div>
          <Select
            isMulti
            options={userOptions}
            value={selectedParticipants}
            onChange={handleSelectChange}
            isClearable={true}
            isSearchable={true}
          />
          <Button variant="light button-modal" onClick={handleAddParticipants}>
            Add Participants
          </Button>
          <Button variant="light button-modal" onClick={handleRemoveParticipants}>
            Remove Participants
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <div className={messageType === 'error' ? 'error-message' : (messageType === 'success' ? 'success-message' : '')}>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditParticipantsButton;
