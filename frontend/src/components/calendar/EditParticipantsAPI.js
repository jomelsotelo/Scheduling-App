
export const updateMeetingParticipants = async (meetingId, addParticipants, removeParticipants) => {
    try {
      const response = await axios.put(`/api/meeting/${meetingId}`, {
        addParticipants,
        removeParticipants,
      });
      return response;
    } catch (error) {
      console.error("Error updating meeting participants:", error);
      throw error;
    }
  };