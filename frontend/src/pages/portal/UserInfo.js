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
                <h2>User Information</h2>
                <Link to="/account">
                    <Button className="button-link" variant="primary" size="lg">
                        Edit Info
                    </Button>{' '}
                </Link>
            </div>
            <p>Name: {user ? `${user.first_name} ${user.last_name}` : 'N/A'}</p>
            <p>Email: {user ? user.email : 'N/A'}</p>
            {/* MORE INFO HERE */}
        </div>
    );
};

export default UserInfo;
