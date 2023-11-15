import React, { useState } from 'react'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import AvailiabilityForm from '../../components/AvailabilityForm'

const localizer = dayjsLocalizer(dayjs)

const MyCalendar = (props) => {
  const [myEventsList, setMyEventsList] = useState([])

  // Function to handle adding availability
  const handleAddAvailability = (newEvent) => {
    setMyEventsList([...myEventsList, newEvent])
  }

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={(slotInfo) => handleAddAvailability(slotInfo)}
        style={{ height: 500 }}
      />
      <AvailiabilityForm onAddAvailability={handleAddAvailability} />
    </div>
  )
}

export default MyCalendar
