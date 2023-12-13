import React, { useState, useEffect } from "react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import CrossImage from '../../assets/images/cross.png';
import TrashCanImage from '../../assets/images/trashcan.png';

const Notification = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notificationToDeleteId, setNotificationToDeleteId] = useState(null);
  const [showClearNotification, setShowClearNotification] = useState(true);
  const [isTrashCanHovered, setIsTrashCanHovered] = useState(false);
  const [isCrossHovered, setIsCrossHovered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('user-token');
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await axiosInstance.get(`/api/notifications/${userId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notification data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMouseEnter = (event) => {
    event.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
  };

  const handleMouseLeave = (event) => {
    event.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setNotificationToDeleteId(notification.notifications_id);
  };

  const handleCloseButtonClick = () => {
    setSelectedNotification(null);
    setNotificationToDeleteId(null);
  };

  const handleTrashButtonClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmationYes = async () => {
    try {
      if (notificationToDeleteId) {
        await axios.delete(`/api/notifications/${notificationToDeleteId}`);
        console.log(`Notification with ID ${notificationToDeleteId} deleted successfully!`);

        setNotificationToDeleteId(null);
        setShowConfirmation(false);
        setSelectedNotification(null);

        window.location.reload();
      } else {
        console.error('No notification ID to delete.');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleConfirmationNo = () => {
    setShowConfirmation(false);
  };

  const handleDeleteAllNotifications = async () => {
    setShowConfirmation(true);
  };

  const handleConfirmationYesAll = async () => {
    try {
      const userId = notifications.length > 0 ? notifications[0].user_id : null;
      if (!userId) {
        console.error('User ID not found in notifications.');
        return;
      }

      for (const notification of notifications) {
        await axios.delete(`/api/notifications/${notification.notifications_id}`);
        console.log(`Notification with ID ${notification.notifications_id} deleted successfully!`);
      }

      console.log(`All notifications for user ${userId} deleted successfully!`);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting notifications:', error);
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleConfirmationNoAll = () => {
    setShowConfirmation(false);
  };

  return (
    <div style={{
      width: 'calc(100vw)',
      height: 'calc(100vh - 70px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '20px',
      position: 'relative',
      background: `
        linear-gradient(#ae445a, transparent),
        linear-gradient(90deg, #451952, transparent),
        linear-gradient(-90deg, #662549, transparent)`,
      backgroundBlendMode: 'screen',
      overflow: 'hidden',
    }}>

      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        top: '50px'
      }}>

        <div style={{
          height: '500px',
          overflowY: 'auto',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '10px',
          marginBottom: '20px',
          color: 'white',
          textAlign: 'center',
          margin: 'auto',
          opacity: 0.65,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '300px',
        }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={{ width: '100%', maxWidth: '400px' }}>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div key={notification.notifications_id} style={{ marginBottom: '10px' }}>
                    <button
                      style={{
                        fontSize: '1.2em',
                        margin: '0',
                        padding: '10px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {notification.entityId === 1 ? 'Message' : 'Update'} - {new Date(notification.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center' }}>No notifications :(</p>
              )}
            </div>
          )}
        </div>

        {showClearNotification && (
          <button
            style={{
              marginTop: '20px',
              width: '50px',
              height: '50px',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              borderRadius: '5px',
              overflow: 'hidden',
            }}
            onClick={handleDeleteAllNotifications}
          >
            <img
              src={TrashCanImage}
              alt="Clear All"
              style={{
                width: '85%',
                height: '85%',
                objectFit: 'cover',
                transition: 'transform 0.3s',
                transform: isTrashCanHovered ? 'scale(1.2)' : 'scale(1)',
              }}
              onMouseEnter={() => setIsTrashCanHovered(true)}
              onMouseLeave={() => setIsTrashCanHovered(false)}
            />
          </button>
        )}

      </div>

      {selectedNotification && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '150px', borderRadius: '10px', position: 'relative', width: '70%', maxWidth: '400px' }}>
            <img src={CrossImage} alt="Close" style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', cursor: 'pointer' }} onClick={handleCloseButtonClick} />

            <h2 style={{ position: 'absolute', top: '20px', left: '10px', marginBottom: '5px' }}>
              {selectedNotification.entityId === 1 && (
                <>
                  <span style={{ fontSize: '1em', opacity: 1 }}>Message</span>
                  <br />
                  <span style={{ fontSize: '0.55em', opacity: 0.75, marginTop: '-1px' }}>
                    {new Date(selectedNotification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                    {new Date(selectedNotification.timestamp).toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })}
                  </span>
                </>
              )}
              {selectedNotification.entityId === 2 && (
                <>
                  <span style={{ fontSize: '1em', opacity: 1 }}>Update</span>
                  <br />
                  <span style={{ fontSize: '0.55em', opacity: 0.75, marginTop: '-1px' }}>
                    {new Date(selectedNotification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                    {new Date(selectedNotification.timestamp).toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })}
                  </span>
                </>
              )}
            </h2>

            <div style={{ position: 'absolute', top: '50%', left: '10px', right: '10px', bottom: '60px', overflowY: 'auto', textAlign: 'center' }}>
               <p style={{ margin: 0 }}>{selectedNotification.content}</p>
                </div>

            <img
              src={TrashCanImage}
              alt="Trashcan"
              style={{ position: 'absolute', bottom: '10px', right: '10px', width: '40px', height: '40px', cursor: 'pointer' }}
              onClick={handleTrashButtonClick}
            />
          </div>
        </div>
      )}

      {showConfirmation && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', position: 'relative', width: '50%', maxWidth: '300px' }}>
            <p style={{ textAlign: 'center' }}>{`Are you sure you want to delete ${selectedNotification ? 'this notification' : 'all notifications'}?`}</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <button
                style={{ background: 'red', color: 'white', padding: '10px', margin: '5px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                onClick={selectedNotification ? handleConfirmationYes : handleConfirmationYesAll}
              >
                Yes
              </button>
              <button
                style={{ background: 'black', color: 'white', padding: '10px', margin: '5px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                onClick={selectedNotification ? handleConfirmationNo : handleConfirmationNoAll}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
