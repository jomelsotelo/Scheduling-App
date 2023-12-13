import axios from "axios";
export const updateAvailability = async (availabilityId, selectedAvailabilitySlot) => {
  try {
    const { start, end } = selectedAvailabilitySlot;
    const response = await axios.put(`/api/user//availability/${availabilityId}`, {
      start_time: start,
      end_time: end,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating availability:", error);
    throw error;
  }
};