import React from "react";

const UserInfo = ({ user }) => {
    return (
        <div>
            <h2>User Information</h2>
            <p>Name: {user ? `${user.first_name} ${user.last_name}` : 'Guest'}</p>
            <p>Email: {user ? user.email : 'N/A'}</p>
            {/* Add more user information as needed */}
        </div>
    );
};

export default UserInfo;
