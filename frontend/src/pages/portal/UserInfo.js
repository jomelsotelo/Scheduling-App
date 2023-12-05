import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import editButtonImage from '../../assets/images/edit-button.png';
import notificationDefaultImage from '../../assets/images/notificationIconDefault.png';
import notificationActiveImage from '../../assets/images/notificationIconActive.png';
import loadingImage from '../../assets/images/loading.png';

const UserInfo = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasNotifications, setHasNotifications] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

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

                const userDataResponse = await axiosInstance.get(`/api/users/${userId}`);
                const userData = userDataResponse.data;
                setUser(userData);

                // Check for notifications
                const notificationsResponse = await axiosInstance.get(`/api/notifications/1`);
                const hasNotifications = notificationsResponse.data.length > 0;
                setHasNotifications(hasNotifications);

                // Set last updated time
                const lastUpdatedTime = userData.updated_at;
                setLastUpdated(lastUpdatedTime);
            } catch (error) {
                console.error('Error fetching user data or notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{
            width: 'calc(100vw)',
            height: 'calc(100vh - 70px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: `
                linear-gradient(#ae445a, transparent),
                linear-gradient(90deg, #451952, transparent),
                linear-gradient(-90deg, #662549, transparent)`,
            overflow: 'hidden',
            backgroundBlendMode: 'screen',
        }}>
            {/* EDIT ICON */}
            <Link to="/account" style={{ position: 'absolute', top: '180px', left: '555px', width: '50px', height: '50px', transition: 'transform 0.2s' }}>
                <img
                    src={loading ? loadingImage : editButtonImage}
                    alt="Edit Info"
                    style={{
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                        objectFit: 'cover',
                        transform: 'scale(1)',
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
            </Link>

            {/* NOTIFICATION ICON */}
            <Link to="/notification" style={{ position: 'absolute', top: '240px', left: '550px', width: '54px', height: '54px', transition: 'transform 0.2s' }}>
                <img
                    src={loading ? loadingImage : (hasNotifications ? notificationActiveImage : notificationDefaultImage)}
                    alt="Notification Icon"
                    style={{
                        width: '110%',
                        height: '110%',
                        cursor: 'pointer',
                        objectFit: 'cover',
                        transform: 'scale(1)',
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
            </Link>

            <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '30px', // Set a fixed height for the black box
                borderRadius: '10px',
                marginBottom: '20px',
                color: 'white',
                textAlign: 'center',
                height: '300px', // Set a fixed height for the black box
                width: '300px', // Set a fixed width for the black box
                overflow: 'hidden', // Hide content overflow
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <h2 style={{ fontSize: '1.5em' }}>{/* TITLE? */}</h2>
                <div style={{ fontSize: '1.2em', marginBottom: '0px' }}>
                    {loading ? 'Loading...' : (user ? <span style={{ fontSize: '1.5em' }}>{`${user.first_name} ${user.last_name}`}</span> : 'N/A')}
                </div>
                <p style={{ marginTop: '-5px', opacity: 0.75 }}>
                    {loading ? 'Loading...' : (user ? user.email : 'N/A')}
                </p>
                <div style={{ fontSize: '0.8em', opacity: 0.6, marginTop: '-10px', textAlign: 'center' }}>
                    Account created: {loading ? 'Loading...' : (user ? new Date(user.created_at).toLocaleString() : 'N/A')}
                </div>
                <div style={{ fontSize: '0.8em', opacity: 0.6, marginTop: '5px', textAlign: 'center' }}>
                    Last updated: {loading ? 'Loading...' : (lastUpdated ? new Date(lastUpdated).toLocaleString() : 'N/A')}
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
