import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConfirmationPopup = ({ onConfirm, onCancel }) => {
  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '100px', background: 'rgba(0, 0, 0, 1)', color: '#fff', zIndex: 999, width: '400px' }}>
      <p>Are you sure?</p>
      <button style={{ margin: '0 10px', cursor: 'pointer', padding: '10px' }} onClick={onConfirm}>
        Yes
      </button>
      <button style={{ margin: '0 10px', cursor: 'pointer', padding: '10px' }} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

const NotificationPopup = ({ notification, onClose, onDelete }) => {
  const formattedDate = new Date(notification.timestamp).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '200px', background: 'rgba(0, 0, 0, 1)', color: '#fff', zIndex: 999, width: '600px' }}>
      <button style={{ position: 'absolute', top: 0, right: 0, padding: '10px', cursor: 'pointer', background: 'grey', border: 'none', color: '#fff' }} onClick={onClose}>
        Close
      </button>
      <button style={{ position: 'absolute', top: 0, right: '60px', padding: '10px', cursor: 'pointer', background: 'red', border: 'none', color: '#fff' }} onClick={onDelete}>
        Delete
      </button>
      <p style={{ position: 'absolute', top: 0, left: 0, padding: '10px', cursor: 'default', background: 'transparent', border: 'none', color: '#fff' }}>From: N/A</p>
      <p>{notification.content}</p>
      <p style={{ position: 'absolute', bottom: 0, left: 0, padding: '10px', cursor: 'default', background: 'transparent', border: 'none', color: '#fff' }}>{formattedDate}</p>
      {/* Add more details or components as needed */}
    </div>
  );
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/notifications/1');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  const handlePopupClose = () => {
    setSelectedNotification(null);
    setShowConfirmation(false);
  };

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedNotification) {
        await axios.delete(`/api/notifications/${selectedNotification.notifications_id}`);
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification.notifications_id !== selectedNotification.notifications_id)
        );
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      handlePopupClose();
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: 125, left: '50%', transform: 'translateX(-50%)', padding: '40px', width: '400px', background: loading ? 'grey' : 'rgba(0, 0, 0, 0.8)', color: '#fff', textAlign: 'center' }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p style={{ textAlign: 'center', fontSize: '1.2em', marginBottom: '10px' }}></p>
            <div style={{ textAlign: 'center' }}>
              {notifications.map((notification) => (
                <p
                  key={notification.notifications_id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{ cursor: 'pointer', transition: 'background 0.3s', margin: '10px 0' }}
                  onMouseOver={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.2)')}
                  onMouseOut={(e) => (e.target.style.background = 'transparent')}
                >
                  {notification.entityId === 1 ? 'Message' : 'Update'} - {new Date(notification.timestamp).toLocaleString('en-US', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                </p>
              ))}
              {notifications.length === 0 && <p>No notifications</p>}
            </div>
          </>
        )}
      </div>

      {selectedNotification && (
        <NotificationPopup notification={selectedNotification} onClose={handlePopupClose} onDelete={handleDelete} />
      )}

      {showConfirmation && (
        <ConfirmationPopup onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
      )}
    </div>
  );
};

export default Notification;
