import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserInfo = () => {
    const [user, setUser] = useState(null);

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
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ textAlign: 'center', fontSize: '1.5em' }}>{/* Add a title if needed */}</h2>
                <Link to="/account">
                    <Button className="button-link" variant="primary" size="lg">
                        Edit Info
                    </Button>{' '}
                </Link>
            </div>
            <p style={{ textAlign: 'center', fontSize: '1.2em', marginBottom: '0' }}>
                {user ? <span style={{ fontSize: '1.5em' }}>{`${user.first_name} ${user.last_name}`}</span> : 'N/A'}
            </p>
            {/* NAME */}
            <p style={{ textAlign: 'center', opacity: 0.75 }}>
                {user ? user.email : 'N/A'}
            </p>
            {/* EMAIL */}
            <p style={{ position: 'absolute', bottom: '0', left: '0', fontSize: '0.8em', opacity: 0.5 }}>
                Account created: {user ? new Date(user.created_at).toLocaleString() : 'N/A'}
            </p>
            {/* WHEN CREATED */}
            {/* MORE INFO GOES HERE */}
        </div>
    );
};

export default UserInfo;
