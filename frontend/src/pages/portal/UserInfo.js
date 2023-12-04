import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserInfo = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Grabs user data
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
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                // Set loading to false regardless of success or failure
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '20px', position: 'relative' }}>
            {/* EDIT INFO */}
            <Link to="/account" style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <Button className="button-link" variant="primary" size="lg">
                    Edit Info
                </Button>
            </Link>
            <div style={{ background: loading ? 'grey' : 'black', padding: '100px 100px', borderRadius: '10px', marginBottom: '20px', color: 'white', textAlign: 'center', margin: 'auto' }}>
                {/* BLACK BOX */}
                <h2 style={{ fontSize: '1.5em' }}>{/* TITLE? */}</h2>
                {/* NAME */}
                <p style={{ fontSize: '1.2em', marginBottom: '0' }}>
                    {loading ? 'Loading...' : (user ? <span style={{ fontSize: '1.5em' }}>{`${user.first_name} ${user.last_name}`}</span> : 'N/A')}
                </p>
                {/* EMAIL */}
                <p style={{ opacity: 0.75 }}>
                    {loading ? 'Loading...' : (user ? user.email : 'N/A')}
                </p>
            </div>
            {/* WHEN CREATED */}
            <div style={{ fontSize: '0.8em', opacity: 0.5, marginBottom: '20px' }}>
                Account created: {loading ? 'Loading...' : (user ? new Date(user.created_at).toLocaleString() : 'N/A')}
            </div>
        </div>
    );
};

export default UserInfo;
