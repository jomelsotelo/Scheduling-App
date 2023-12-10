import React, { useState, useEffect } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import { createAvailability } from "../../components/availability";
import CreateMeetingForm from "../../components/CreateMeetingForm";

const localizer = dayjsLocalizer(dayjs);

const MyCalendar = (props) => {
  // State variables
  const [show, setShow] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [combinedEvents, setCombinedEvents] = useState([]);
  const [myEventsList, setMyEventsList] = useState([]);
  const [user, setUser] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [isCreateMeetingFormVisible, setCreateMeetingFormVisible] = useState(false);
  const [isAddingAvailability, setAddingAvailability] = useState(true);
  const [isCreatingMeeting, setCreatingMeeting] = useState(false);
  const [isMeetingCreationCanceled, setMeetingCreationCanceled] = useState(false);
  const [selectedAvailabilitySlot, setSelectedAvailabilitySlot] = useState(null);
  const [selectedMeetingSlot, setSelectedMeetingSlot] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const handleShow = () => {
    setShow(true);
  };

  // Define handleClose function
  const handleClose = () => {
    setShow(false);
  };

  // Fetch user options on component mount
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

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data from the server
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("user-token");

      if (token) {
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const [
          userDataResponse,
          availabilitiesResponse,
          meetingsResponse,
        ] = await Promise.all([
          axiosInstance.get(`/api/users/${userId}`),
          axiosInstance.get(`/api/user/${userId}/availability`),
          axiosInstance.get(`/api/meeting/${userId}`),
        ]);

        const userData = userDataResponse.data;
        const availabilitiesData = availabilitiesResponse.data;
        const meetingsData = meetingsResponse.data;

        const meetingsArray = Array.isArray(meetingsData) ? meetingsData : [];

        setUser(userData);

        const mappedAvailabilities = availabilitiesData.map((availability) => ({
          title: "Available",
          start: new Date(availability.start_time),
          end: new Date(availability.end_time),
          availability_id: availability.availability_id,
          type: "availability",
        }));

        const mappedMeetings = meetingsArray.flatMap((meeting) => {
          const currentUserParticipant = meeting.participants.find(
            (participant) => participant.user_id === userId
          );

          if (currentUserParticipant) {
            return [
              {
                title: meeting.title,
                start: new Date(meeting.start_time),
                end: new Date(meeting.end_time),
                meeting_id: meeting.meeting_id,
                participant: {
                  user_id: currentUserParticipant.user_id,
                  first_name: currentUserParticipant.first_name,
                  last_name: currentUserParticipant.last_name,
                  email: currentUserParticipant.email,
                },
                type: "meeting",
              },
            ];
          } else {
            return [];
          }
        });

        const updatedCombinedEvents = [...mappedAvailabilities, ...mappedMeetings];
        setCombinedEvents(updatedCombinedEvents);
        setMyEventsList(updatedCombinedEvents);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Show details of the selected event
  const handleShowDetails = async (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);

    if (event.type === "meeting") {
      try {
        const response = await axios.get(`/api/meeting/${user.user_id}`);
        const meetingDetails = response.data;
        const selectedMeeting = meetingDetails.find(
          (meeting) => meeting.meeting_id === event.meeting_id
        );

        setMeetingDetails(selectedMeeting);
      } catch (error) {
        console.error("Error fetching meeting details:", error);
      }
    }
  };

  // Close the details modal
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
  };

  // Handle slot selection in the calendar
  const handleSelectSlot = (slotInfo) => {
    const { action } = slotInfo;

    if (action === "select") {
      isCreatingMeeting
        ? handleSelectMeetingSlot(slotInfo)
        : handleSelectAvailabilitySlot(slotInfo);
    }
  };

  // Handle availability slot selection
  const handleSelectAvailabilitySlot = (slotInfo) => {
    const { start, end, action } = slotInfo;

    if (action === "select") {
      setSelectedAvailabilitySlot({ start, end });
    }
  };

  // Handle meeting slot selection
  const handleSelectMeetingSlot = (slotInfo) => {
    const { start, end, action } = slotInfo;

    if (action === "select") {
      setSelectedMeetingSlot({ start, end });
    }
  };

  // Confirm the selected availability or meeting slot
  const handleConfirmSelection = async () => {
    try {
      if (isAddingAvailability && selectedAvailabilitySlot) {
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

        console.log("Availability created successfully:", response.data);
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSelectedAvailabilitySlot(null);
    }
  };

  // Cancel the selected availability or meeting slot
  const handleCancelSelection = () => {
    setSelectedAvailabilitySlot(null);
    setSelectedMeetingSlot(null);
  };

  // Remove an availability event
  const handleRemoveAvailability = (event) => {
    const availabilityId = event.availability_id;
    const user_id = user?.user_id;

    axios
      .delete(`/api/user/${user_id}/availability/${availabilityId}`)
      .then((response) => {
        console.log(response.data.message);

        setMyEventsList((prevEvents) =>
          prevEvents.filter((e) => e.availability_id !== event.availability_id)
        );

        handleCloseDetailsModal();
      })
      .catch((error) => {
        console.error("Error removing availability:", error);
      });
  };

  // Remove a meeting event
  const handleRemoveMeeting = (event) => {
    const meetingId = event.meeting_id;
    const user_id = user?.user_id;

    axios
      .delete(`/api/meeting/${meetingId}`)
      .then((response) => {
        console.log(response.data.message);

        setMyEventsList((prevEvents) =>
          prevEvents.filter((e) => e.meeting_id !== event.meeting_id)
        );

        handleCloseDetailsModal();
      })
      .catch((error) => {
        console.error("Error removing meeting:", error);
      });
  };

  // Toggle the create meeting form visibility
  const toggleCreateMeetingForm = () => {
    setMyEventsList([]);
    setCreateMeetingFormVisible(!isCreateMeetingFormVisible);
    setAddingAvailability(true);
    setMeetingCreationCanceled(false);
    setCreatingMeeting(!isCreateMeetingFormVisible);
  };

  // Handle participants change for common availabilities
  const handleParticipantsChange = async (selectedOptions) => {
    setAvailableTimeSlots([]);
    try {
      const userIDs = selectedOptions.map((participant) => participant.value);
      const response = await axios.get(`/api/timeslots/[${userIDs.join(",")}]`);
      const commonAvailabilities = response.data;

      setAvailableTimeSlots(
        commonAvailabilities.map((availability, index) => ({
          title: "Available",
          start: new Date(availability.start_time),
          end: new Date(availability.end_time),
          type: "commonAvailability",
        }))
      );

      setSelectedParticipants(selectedOptions);
    } catch (error) {
      console.error("Error fetching common availabilities:", error);
    }
  };

  // Handle creating a meeting
  const handleCreateMeeting = async (meetingData) => {
    try {
      if (
        meetingData.title &&
        meetingData.participants.length > 0 &&
        meetingData.start &&
        meetingData.end
      ) {
        const user_id = user?.user_id;
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

        const newEvent = {
          title: meetingData.title,
          start: new Date(createdMeeting.start_time),
          end: new Date(createdMeeting.end_time),
          type: "meeting",
        };

        setMyEventsList((prevEvents) => [...prevEvents, newEvent]);
      } else {
        console.error("Incomplete meeting details or no participants selected");
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
    } finally {
      handleCancelCreateMeeting();
    }
  };

  // Handle canceling the create meeting process
  const handleCancelCreateMeeting = async () => {
    try {
      if (isAddingAvailability) {
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error canceling create meeting:", error);
    } finally {
      setAvailableTimeSlots([]);
      setCreateMeetingFormVisible(false);
      setAddingAvailability(true);
      setCreatingMeeting(false);
      setMeetingCreationCanceled(false);

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
        onSelectEvent={(event, e) => handleShowDetails(event)}
        eventPropGetter={(event) => {
          // Use different colors based on the event type
          if (event.type === "availability") {
            return { style: { backgroundColor: "navy" } }; // Adjust the color for availability events
          } else if (event.type === "commonAvailability") {
            return { style: { backgroundColor: "green" } }; // Adjust the color for common availability events
          } else if (event.type === "meeting") {
            return {
              style: { backgroundColor: event.color || "red" }, // Use the event's color or default to red
            };
          } else {
            return {}; // Default style for other events
          }
        }}
      />
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <p>Title: {selectedEvent.title}</p>
              <p>Start Time: {selectedEvent.start.toLocaleString()}</p>
              <p>End Time: {selectedEvent.end.toLocaleString()}</p>
              {/* Display participants for meetings */}
              {selectedEvent.type === "meeting" && meetingDetails && (
                <div>
                  <p>Participants:</p>
                  {meetingDetails.participants &&
                  meetingDetails.participants.length > 0 ? (
                    meetingDetails.participants.map((participant, index) => (
                      <p key={index}>
                        {`${participant.first_name} ${participant.last_name} - ${participant.email}`}
                      </p>
                    ))
                  ) : (
                    <p>No participants</p>
                  )}
                </div>
              )}
              {selectedEvent.type === "availability" && (
                <div>
                  {/* Add Remove button for availability */}
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveAvailability(selectedEvent)}
                  >
                    Remove
                  </Button>
                </div>
              )}
              {selectedEvent.type === "meeting" && (
                <div>
                  {/* Add Remove button for meeting */}
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveMeeting(selectedEvent)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {selectedAvailabilitySlot && (
        <div>
          <p>
            <strong>Selected Availability Slot:</strong>
          </p>
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
          className="meetingModificationButton"
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
          className="meetingModificationButton"
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
          <strong>Availability:</strong>
          <p>To create your availability, follow these steps:</p>
          <p>
            1. <strong>Select a timeslot on the calendar:</strong> Drag your
            cursor to choose a time range when you are available. You can also
            click on the "Week" or "Day" view to select a specific time for that
            day.
          </p>
          <p>
            2. <strong>Confirm your selection:</strong> Click the "Confirm"
            button to save your availability.
          </p>
          <p>
            3. <strong>Review and remove if needed:</strong> After confirmation,
            you can review your availabilities in the calendar. To remove an
            availability, click the "Remove" button in the event details.
          </p>
          <p>
            Note: Your availability will be visible to other participants when
            scheduling meetings.
          </p>
          <br />
          <strong>Meeting:</strong>
          <p>To schedule a meeting, follow these steps:</p>
          <p>
            1. <strong>Type in the Title:</strong> Enter a descriptive title for
            your meeting.
          </p>
          <p>
            2. <strong>Select at least two participants:</strong> Choose
            participants from the list to invite to the meeting.
          </p>
          <p>
            3.{" "}
            <strong>Available timeslots will display on the calendar:</strong>{" "}
            Once you've selected participants, the calendar will show available
            timeslots when they overlap. If nothing is displayed, it means there
            are no common availabilities.
          </p>
          <p>
            4.{" "}
            <strong>
              Select the meeting date based on the available timeslot:
            </strong>{" "}
            Click and drag your cursor on the calendar to choose a suitable date
            and time for the meeting. You can also click on the "Week" or "Day"
            view to select a specific time for that day.
          </p>
          <p>
            Note: If no available timeslots are shown, consider adjusting the
            participants' schedules or trying different meeting times.
          </p>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default MyCalendar;
