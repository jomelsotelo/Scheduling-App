import React, { useState } from 'react'

const AvailabilityForm = ({ onAddAvailability }) => {
  const [availability, setAvailability] = useState({
    title: 'Available', // You can customize the title
    start: null,
    end: null,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddAvailability(availability)
    setAvailability({
      title: 'Available',
      start: null,
      end: null,
    })
  }

  const handleInputChange = (field, value) => {
    setAvailability({
      ...availability,
      [field]: value,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Start Time:</label>
      <input
        type="datetime-local"
        value={availability.start || ''}
        onChange={(e) => handleInputChange('start', e.target.value)}
        required
      />

      <label>End Time:</label>
      <input
        type="datetime-local"
        value={availability.end || ''}
        onChange={(e) => handleInputChange('end', e.target.value)}
        required
      />

      <button type="submit">Add Availability</button>
    </form>
  )
}

export default AvailabilityForm