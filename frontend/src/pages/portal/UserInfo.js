import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import editButtonImage from '../../assets/images/edit-button.png';
import notificationDefaultImage from '../../assets/images/notificationIconDefault.png';
import notificationActiveImage from '../../assets/images/notificationIconActive.png';
import loadingImage from '../../assets/images/loading.png';
import TrashCanImage from '../../assets/images/trashcan.png';
import InfoImage from '../../assets/images/info.png'

const UserInfo = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasNotifications, setHasNotifications] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

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
                const notificationsResponse = await axiosInstance.get(`/api/notifications/${userId}`);
                const hasNotifications = notificationsResponse.data.length > 0;
                setHasNotifications(hasNotifications);

                // Set last updated time
                const lastUpdatedTime = userData.updated_at;
                // Check if userData is not null before setting lastUpdated
                if (lastUpdatedTime) {
                    setLastUpdated(lastUpdatedTime);
                }
            } catch (error) {
                console.error('Error fetching user data or notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteAccount = async () => {
        setShowConfirmation(true);
    };

    const confirmDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('user-token');
            const axiosInstance = axios.create({
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Extract user_id from the backend payload
            const user_id = user.user_id;

            await axiosInstance.delete(`/api/users/${user_id}`);

            // Redirect to login after successful deletion
            window.location.href = '/auth/login';
        } catch (error) {
            console.error('Error deleting user account:', error);
        }
    };

    const cancelDeleteAccount = () => {
        setShowConfirmation(false);
    };

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

            <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>

                <div style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    padding: '30px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    color: 'white',
                    textAlign: 'center',
                    height: '300px',
                    width: '300px',
                    overflow: 'hidden',
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

                <Link to="/account" style={{ position: 'absolute', top: '0px', left: '-60px', width: '50px', height: '50px', transition: 'transform 0.2s' }}>
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

                <Link to="/notification" style={{ position: 'absolute', top: '55px', left: '-65px', width: '54px', height: '54px', transition: 'transform 0.2s' }}>
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

                {/* Info button link to /info */}
                <Link to="/info" style={{ position: 'absolute', top: '250px', left: '-60px', width: '52px', height: '52px', transition: 'transform 0.2s' }}>
                    <img
                        src={loading ? loadingImage : InfoImage}
                        alt="Extra Info"
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

                <button
                    onClick={handleDeleteAccount}
                    style={{ position: 'absolute', top: '250px', right: '-60px', width: '54px', height: '54px', background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}
                >
                    <img
                        src={loading ? loadingImage : TrashCanImage}
                        alt="Delete Account"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: 'scale(1)',
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                </button>

                {showConfirmation && (
                    <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                            <p>Are you sure you want to delete your account?</p>
                            <button onClick={confirmDeleteAccount} style={{ background: 'red', color: 'white', padding: '10px', margin: '10px', cursor: 'pointer' }}>Yes, I am sure</button>
                            <button onClick={cancelDeleteAccount} style={{ background: 'green', color: 'white', padding: '10px', margin: '10px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserInfo;
