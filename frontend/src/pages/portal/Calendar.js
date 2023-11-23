import React, { useState, useEffect } from 'react'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import axios from 'axios'
import { createAvailability } from '../../components/availability'
import { jwtDecode } from 'jwt-decode'
import CreateMeetingForm from '../../components/CreateMeetingForm'

const localizer = dayjsLocalizer(dayjs)

const MyCalendar = (props) => {
  const [myEventsList, setMyEventsList] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [user, setUser] = useState(null);
  const [isCreateMeetingFormVisible, setCreateMeetingFormVisible] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [availableTimeslots, setAvailableTimeslots] = useState([]);

  useEffect(() => {
    const loadUserOptions = async () => {
      const options = await fetchUsers();
      setUserOptions(options);
    };

    loadUserOptions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      const users = response.data;
 
      // Format the users as options for react-select
      const userOptions = users.map((user) => ({
        value: user.user_id,
        label: `${user.first_name} ${user.last_name} - ${user.email}`,
      }));
 
      return userOptions;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Gets the token from local storage
        const token = localStorage.getItem('user-token')


        if (token) {
          const axiosInstance = axios.create({
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const decodedToken = jwtDecode(token)
          const userId = decodedToken.userId;

          // Send a request to the server to get user data
          const userDataResponse = await axiosInstance.get(`/api/users/${userId}`)

          // Sends a request to get user availabilities
          const availabilitiesResponse = await axiosInstance.get(`/api/user/${userId}/availability`)

          const userData = userDataResponse.data;
          const availabilitiesData = availabilitiesResponse.data

          // Updates the state to store the user data
          setUser(userData)

          // Map availabilities to the format expected by the calendar
          const mappedAvailabilities = availabilitiesData.map((availability) => ({
            title: 'Available',
            start: new Date(availability.start_time),
            end: new Date(availability.end_time),
            availability_id: availability.availability_id,
          }));

          const newAvailabilityMap = {}
          mappedAvailabilities.forEach((availability, index) => {
            newAvailabilityMap[availability.availability_id] = index
          })

          // Updates the state to store the mapped availabilities
          setMyEventsList(mappedAvailabilities)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        // Handle error
      }
    }
    // Call the function to fetch user data when the component mounts
    fetchUserData()
  }, [])

  // Function to handle adding availability
  const handleSelectSlot = (slotInfo) => {
    const { start, end, action } = slotInfo;
    if (action === 'select') {
      setSelectedSlot({ start, end });
    }
  };

  const handleConfirmSelection = (token) => {
    if (selectedSlot) {
      const formatToMySQLTimestamp = (dateTime) => dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
      const newEvent = {
        title: 'Available',
        start: formatToMySQLTimestamp(selectedSlot.start),
        end: formatToMySQLTimestamp(selectedSlot.end),
      };
      const user_id = user?.user_id

      // Calls the createAvailability function from availability.js
      createAvailability(
        user_id,
        newEvent.start,
        newEvent.end
      )
        .then((data) => {
          // Handles success
          console.log('Availability created successfully:', data)


          // Fetches the updated user availabilities after creation
          return axios.get(`/api/user/${user_id}/availability`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        })
        .then((availabilitiesResponse) => {
          const availabilitiesData = availabilitiesResponse.data


          // Map availabilities to the format expected by the calendar
          const mappedAvailabilities = availabilitiesData.map((availability) => ({
            title: 'Available',
            start: new Date(availability.start_time),
            end: new Date(availability.end_time),
            availability_id: availability.availability_id,
          }))

          setMyEventsList(mappedAvailabilities);
          setSelectedSlot(null); // Clears the selected slot
        })
        .catch((error) => {
          // Handles error
          console.error('Error creating availability:', error);
        })
    }
  }


  const handleCancelSelection = () => {
    setSelectedSlot(null); // Clears the selected slot
  }

  const handleRemoveAvailability = (event) => {
    const availabilityId = event.availability_id
    const user_id = user?.user_id

    axios.delete(`/api/user/${user_id}/availability/${availabilityId}`)
      .then((response) => {
        console.log(response.data.message)


        //Updates the events list
        const updatedEventsList = myEventsList.filter((e) => e.availability_id !== event.availability_id)
        setMyEventsList(updatedEventsList)
      })
      .catch((error) => {
        console.error('Error removing availability:', error)
      })
  };

  //Function to fetch all users for button
  let showUsers = () => {
    axios.get("api/users")
      .then(response => {
        //const { firstName, lastName, email } = response.data;
        console.log("All Users: ", response.data)
        var list = response.data;

        list.forEach(function (arrayItem) {
          //let id = arrayItem.user_id;
          let firstName = arrayItem.first_name
          let lastName = arrayItem.last_name
          let email = arrayItem.email
          console.log("First Name: " + firstName + " \nLast Name: " + lastName + " \nEmail: " + email)
        });
      })
      .catch(error => {
        console.error('Error', error)
      });

  }
  //Show first name, last name, email
  //https://react-select.com/home

  //https://mui.com/material-ui/react-table/
  //https://stackoverflow.com/questions/69222920/module-not-found-cant-resolve-mui-x-data-grid-in-c-users-syndicate-docume
  //https://stackoverflow.com/questions/67965481/how-to-assign-data-to-a-variable-from-axios-get-response

  //Get from timeslots from botton


  const toggleCreateMeetingForm = () => {
    setCreateMeetingFormVisible(!isCreateMeetingFormVisible);
  };

  const handleCreateMeeting = async (meetingData) => {
    if (meetingData.title && meetingData.participants.length > 0) {
      try {
        const user_id = user?.user_id;


        // Prepare data for API request
        const requestData = {
          users: meetingData.participants.map((participant) => ({ id: participant.value })),
          duration: meetingData.duration,
          date: dayjs(meetingData.date).format('YYYY-MM-DD HH:mm:ss'),
        };


        // Call your API endpoint to get available timeslots
        const response = await axios.get('/api/timeslots', { params: requestData });
        const availableTimeslots = response.data;


        if (availableTimeslots.length > 0) {
          // Update the calendar with the new available timeslots
          setAvailableTimeslots(availableTimeslots);
        } else {
          console.error('No available timeslots found');
        }
      } catch (error) {
        console.error('Error updating calendar:', error);
      }
    } else {
      // Handle case where meeting details are incomplete or participants are not selected
      console.error('Incomplete meeting details or no participants selected');
    }
    setCreateMeetingFormVisible(false);
  };


  return (
    <div>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: 500 }}
        step={5}
      />
      {selectedSlot && (
        <div>
          <p>Selected Slot:</p>
          <p>Start: {selectedSlot.start.toLocaleString()}</p>
          <p>End: {selectedSlot.end.toLocaleString()}</p>
          <button onClick={handleConfirmSelection}>Confirm</button>
          <button onClick={handleCancelSelection}>Cancel</button>
        </div>
      )}
      <div>
        <button onClick={toggleCreateMeetingForm}>Create Meeting</button>


        {/* Create Meeting Form */}
        {isCreateMeetingFormVisible && (
          <CreateMeetingForm
            onSubmit={handleCreateMeeting}
            onCancel={toggleCreateMeetingForm}
            userOptions={userOptions}
          />
        )}
      </div>
      <div>
        <legend>Directions</legend>
        <p>Drag your cursor to select your available time.</p>
        <p>Select Week or Day to pick a specific time.</p>
      </div>
      <div>
        <p>Selected Availabilities:</p>
        {myEventsList.map((event, index) => (
          <div key={index}>
            {event.title} - {event.start.toLocaleString()} to {event.end.toLocaleString()}
            <button onClick={() => handleRemoveAvailability(event)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyCalendar
