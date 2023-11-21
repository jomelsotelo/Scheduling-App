import React, { useState } from 'react'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import axios from 'axios'


const localizer = dayjsLocalizer(dayjs)

const MyCalendar = (props) => {
  const [myEventsList, setMyEventsList] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)

  // Function to handle adding availability
  const handleSelectSlot = (slotInfo) => {
    const { start, end, action } = slotInfo;

    // Check the current view to determine how to handle the selection
    if (action === 'select') {
      if (props.view === 'month') {
        // In month view, select the whole day
        setSelectedSlot({ start: dayjs(start).startOf('day'), end: dayjs(end).endOf('day') });
      } else {
        // In day/week view, select the specific time
        setSelectedSlot({ start, end });
      }
    } else if (action === 'click') {
      // Handle click events if needed
    }
  };

  const handleConfirmSelection = () => {
    if (selectedSlot) {
      const newEvent = {
        title: 'Available',
        start: selectedSlot.start,
        end: selectedSlot.end,
      };

      setMyEventsList([...myEventsList, newEvent]);
      setSelectedSlot(null); // Clear the selected slot
    }
  };

  const handleCancelSelection = () => {
    setSelectedSlot(null); // Clear the selected slot
  };

  const handleRemoveAvailability = (event) => {
    const updatedEventsList = myEventsList.filter((e) => e !== event);
    setMyEventsList(updatedEventsList);
  };

  //Function to fetch all users for button
  let showUsers = () => {
    axios.get("api/users")
      .then(response => {
        //const { firstName, lastName, email } = response.data;
        console.log("All Users: ", response.data);
        var list = response.data;

        list.forEach(function (arrayItem) {
          //let id = arrayItem.user_id;
          let firstName = arrayItem.first_name;
          let lastName = arrayItem.last_name;
          let email = arrayItem.email;
          console.log("First Name: " + firstName + " \nLast Name: " + lastName + " \nEmail: " + email);
        });
      })
      .catch(error => {
        console.error('Error', error);
      });

  }
  //Show first name, last name, email
  //https://react-select.com/home

  //https://mui.com/material-ui/react-table/
  //https://stackoverflow.com/questions/69222920/module-not-found-cant-resolve-mui-x-data-grid-in-c-users-syndicate-docume
  //https://stackoverflow.com/questions/67965481/how-to-assign-data-to-a-variable-from-axios-get-response
  let displayUsers = () => {
    Document.getElementById();
  }
  //Get from timeslots from botton
  let showTimeslots = () => {

    axios.get("/api/timeslots/")
      .then(response => {
        console.log('Response: ', response);
      })
      .catch(error => {
        console.error('Error', error);
      });
    //console.log(getSlots);
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
        <p></p>
        <button id="showUsers" onClick={showUsers}>Show All Users</button>
        <button id="showTimeslots" onClick={showTimeslots}>Connect to Timeslots</button>

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
