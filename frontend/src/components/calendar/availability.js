// availabilityApi.js
export const createAvailability = async (user_id, start_time, end_time) => {
    try {
      const response = await fetch(`/api/user/${user_id}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          start_time,
          end_time,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create availability');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating availability:', error);
      throw error; // Rethrow the error for the caller to handle
    }
  };
  