import React, { useState } from 'react'

const MeetingModal = ({ onClose, onAddMeeting }) => {
  const [meetingDetails, setMeetingDetails] = useState({
    title: '',
    start: null,
    end: null,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddMeeting(meetingDetails)
    setMeetingDetails({
      title: '',
      start: null,
      end: null,
    })
    onClose()
  }

  const handleInputChange = (field, value) => {
    setMeetingDetails({
      ...meetingDetails,
      [field]: value,
    })
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={meetingDetails.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />

          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={meetingDetails.start || ''}
            onChange={(e) => handleInputChange('start', e.target.value)}
            required
          />

          <label>End Time:</label>
          <input
            type="datetime-local"
            value={meetingDetails.end || ''}
            onChange={(e) => handleInputChange('end', e.target.value)}
            required
          />

          <button type="submit">Create Meeting</button>
        </form>
      </div>
    </div>
  )
}

export default MeetingModal