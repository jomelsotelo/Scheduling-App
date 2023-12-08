import React, { useState, useEffect } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import axios from "axios";
import { createAvailability } from "../../components/availability";
import { jwtDecode } from "jwt-decode";
import CreateMeetingForm from "../../components/CreateMeetingForm";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

const localizer = dayjsLocalizer(dayjs);

const MyCalendar = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [myEventsList, setMyEventsList] = useState([]);
  const [user, setUser] = useState(null);
  const [userOptions, setUserOptions] = useState([]);

  const [isCreateMeetingFormVisible, setCreateMeetingFormVisible] =
    useState(false);
  const [isAddingAvailability, setAddingAvailability] = useState(true);
  const [isCreatingMeeting, setCreatingMeeting] = useState(false);
  const [isMeetingCreationCanceled, setMeetingCreationCanceled] =
    useState(false);

  const [selectedAvailabilitySlot, setSelectedAvailabilitySlot] =
    useState(null);
  const [selectedMeetingSlot, setSelectedMeetingSlot] = useState(null);

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  useEffect(() => {
    const loadUserOptions = async () => {
      const options = await fetchUsers();
      setUserOptions(options);
    };

    loadUserOptions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      const users = response.data;

      // Format the users as options for react-select
      const userOptions = users.map((user) => ({
        value: user.user_id,
        label: `${user.first_name} ${user.last_name} - ${user.email}`,
      }));

      return userOptions;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const fetchUserData = async () => {
    try {
      // Gets the token from local storage
      const token = localStorage.getItem("user-token");

      if (token) {
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        // Send a request to the server to get user data
        const userDataResponse = await axiosInstance.get(
          `/api/users/${userId}`
        );

        // Sends a request to get user availabilities
        const availabilitiesResponse = await axiosInstance.get(
          `/api/user/${userId}/availability`
        );

        const userData = userDataResponse.data;
        const availabilitiesData = availabilitiesResponse.data;

        // Updates the state to store the user data
        setUser(userData);

        // Map availabilities to the format expected by the calendar
        const mappedAvailabilities = availabilitiesData.map((availability) => ({
          title: "Available",
          start: new Date(availability.start_time),
          end: new Date(availability.end_time),
          availability_id: availability.availability_id,
          type: "availability",
        }));

        const newAvailabilityMap = {};
        mappedAvailabilities.forEach((availability, index) => {
          newAvailabilityMap[availability.availability_id] = index;
        });

        // Updates the state to store the mapped availabilities
        setMyEventsList(mappedAvailabilities);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error
    }
  };

  useEffect(() => {
    // Call the function to fetch user data when the component mounts
    fetchUserData();
  }, []);

  const handleSelectSlot = (slotInfo) => {
    const { action } = slotInfo;
    if (action === "select") {
      if (isCreatingMeeting) {
        // If creating a meeting, use handleSelectMeetingSlot
        handleSelectMeetingSlot(slotInfo);
      } else {
        // If adding availability, use handleSelectAvailabilitySlot
        handleSelectAvailabilitySlot(slotInfo);
      }
    }
  };

  // Function to handle adding availability
  const handleSelectAvailabilitySlot = (slotInfo) => {
    const { start, end, action } = slotInfo;
    if (action === "select") {
      setSelectedAvailabilitySlot({ start, end });
    }
  };

  // Function to handle selecting a date for creating a meeting
  const handleSelectMeetingSlot = (slotInfo) => {
    const { start, end, action } = slotInfo;
    if (action === "select") {
      setSelectedMeetingSlot({ start, end });
    }
  };

  const handleConfirmSelection = async () => {
    try {
      if (isAddingAvailability && selectedAvailabilitySlot) {
        // Code for adding availability
        const formatToMySQLTimestamp = (dateTime) =>
          dayjs(dateTime).format("YYYY-MM-DD HH:mm:ss");
        const newEvent = {
          title: "Available",
          start: formatToMySQLTimestamp(selectedAvailabilitySlot.start),
          end: formatToMySQLTimestamp(selectedAvailabilitySlot.end),
          type: "availability",
        };
        const user_id = user?.user_id;

        const response = await createAvailability(
          user_id,
          newEvent.start,
          newEvent.end
        );

        // Handles success
        console.log("Availability created successfully:", response.data);

        // Fetches the updated user availabilities after creation
        await fetchUserData();
      }
    } catch (error) {
      // Handles error
      console.error("Error:", error);
    } finally {
      // Reset the selectedAvailabilitySlot state
      setSelectedAvailabilitySlot(null);
    }
  };

  const handleCancelSelection = () => {
    // Reset the selectedAvailabilitySlot and selectedMeetingSlot states
    setSelectedAvailabilitySlot(null);
    setSelectedMeetingSlot(null);
  };

  const handleRemoveAvailability = (event) => {
    const availabilityId = event.availability_id;
    const user_id = user?.user_id;

    axios
      .delete(`/api/user/${user_id}/availability/${availabilityId}`)
      .then((response) => {
        console.log(response.data.message);

        // Updates the events list
        setMyEventsList((prevEvents) =>
          prevEvents.filter((e) => e.availability_id !== event.availability_id)
        );
      })
      .catch((error) => {
        console.error("Error removing availability:", error);
      });
  };

  const toggleCreateMeetingForm = () => {
    setMyEventsList([]);
    setCreateMeetingFormVisible(!isCreateMeetingFormVisible);
    setAddingAvailability(true);
    setMeetingCreationCanceled(false);
    setCreatingMeeting(!isCreateMeetingFormVisible);
  };

  const handleParticipantsChange = async (selectedOptions) => {
    setAvailableTimeSlots([]);
    try {
      // Prepare user IDs array from the selected participants
      const userIDs = selectedOptions.map((participant) => participant.value);

      // Call your API endpoint to get common availabilities using GET request
      const response = await axios.get(`/api/timeslots/[${userIDs.join(",")}]`);

      const commonAvailabilities = response.data;

      // Update the state with the new common availabilities, specifying the color
      setAvailableTimeSlots(
        commonAvailabilities.map((availability, index) => ({
          title: "Free",
  start: new Date(availability.start_time),
  end: new Date(availability.end_time),
  type: "commonAvailability", // Add a type property for common availabilities
        }))
      );

      // Update the state with the updated participants
      setSelectedParticipants(selectedOptions);
    } catch (error) {
      console.error("Error fetching common availabilities:", error);
    }
  };

  const handleCreateMeeting = async (meetingData) => {
    if (meetingData.title && meetingData.participants.length > 0) {
      try {
        const user_id = user?.user_id;

        // Prepare data for API request
        const requestData = {
          title: meetingData.title,
          start_time: meetingData.start,
          end_time: meetingData.end,
          participants: meetingData.participants.map(
            (participant) => participant.value
          ),
        };

        const response = await axios.post("/api/meeting", requestData);
        const createdMeeting = response.data;

        // Update the calendar with the new meeting
        const newEvent = {
          title: meetingData.title,
  start: new Date(createdMeeting.start_time),
  end: new Date(createdMeeting.end_time),
  type: "meeting", // Add a type property for meetings
        };

        setMyEventsList((prevEvents) => [...prevEvents, newEvent]);
      } catch (error) {
        console.error("Error creating meeting:", error);
      }
    } else {
      // Handle case where meeting details are incomplete or participants are not selected
      console.error("Incomplete meeting details or no participants selected");
    }

    setCreateMeetingFormVisible(false);
    setAddingAvailability(false);
    setMeetingCreationCanceled(false);
  };

  const handleCancelCreateMeeting = async () => {
    try {
      if (isAddingAvailability) {
        // Restore original availabilities
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error canceling create meeting:", error);
    } finally {
      // Reset the availableTimeSlots state
      setAvailableTimeSlots([]);
      setCreateMeetingFormVisible(false);
      setAddingAvailability(true);
      setCreatingMeeting(false);
      setMeetingCreationCanceled(false);

      // Reset selectedMeetingSlot only if canceled
      if (isMeetingCreationCanceled) {
        setSelectedMeetingSlot(null);
      }
    }
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={[...myEventsList, ...availableTimeSlots]} // Merge current events with available time slots
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: 500 }}
        step={5}
        onSelectEvent={(event, e) => handleRemoveAvailability(event)}
        eventPropGetter={(event) => {
          // Use different colors based on the event type
          if (event.type === "availability") {
            return { style: { backgroundColor: 'blue' } }; // Adjust the color for availability events
          } else if (event.type === "commonAvailability") {
            return { style: { backgroundColor: 'green' } }; // Adjust the color for common availability events
          } else if (event.type === "meeting") {
            return { style: { backgroundColor: 'red' } }; // Adjust the color for meeting events
          } else {
            return {}; // Default style for other events
          }
        }}
      />
      {selectedAvailabilitySlot && (
        <div>
          <p>Selected Availability Slot:</p>
          <p>Start: {selectedAvailabilitySlot.start.toLocaleString()}</p>
          <p>End: {selectedAvailabilitySlot.end.toLocaleString()}</p>
          <Button
            variant="primary"
            onClick={() => handleConfirmSelection(selectedAvailabilitySlot)}
          >
            Confirm
          </Button>
          <button onClick={handleCancelSelection}>Cancel</button>
        </div>
      )}

      <div>
        <button
          id="meetingButton"
          class="meetingModificationButton"
          onClick={toggleCreateMeetingForm}
        >
          Create Meeting
        </button>

        {/* Create Meeting Form */}
        {isCreateMeetingFormVisible && (
          <CreateMeetingForm
            onSubmit={handleCreateMeeting}
            onCancel={handleCancelCreateMeeting}
            userOptions={userOptions}
            selectedMeetingSlot={isCreatingMeeting ? selectedMeetingSlot : null}
            onParticipantsChange={handleParticipantsChange}
          />
        )}
        <button
          id="helpButton"
          class="meetingModificationButton"
          onClick={handleShow}
        >
          Need Help?
        </button>
      </div>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Directions</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Drag your cursor to select your available time.
        </Offcanvas.Body>
        <Offcanvas.Body>
          Select Week or Day to pick a specific time.
        </Offcanvas.Body>
      </Offcanvas>
      <div>
        <p>Selected Availabilities:</p>
        {myEventsList.map((event, index) => (
          <div key={index}>
            {event.title} - {event.start.toLocaleString()} to{" "}
            {event.end.toLocaleString()}
            <Button
              variant="primary"
              onClick={() => handleRemoveAvailability(event)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCalendar;
