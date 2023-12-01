import React from "react";

const UserInfo = ({ user }) => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>User Information</h2>
                <button onClick={() => { /* CODE HERE */ }}>Edit Info</button>
            </div>
            <p>Name: {user ? `${user.first_name} ${user.last_name}` : 'Guest'}</p>
            <p>Email: {user ? user.email : 'N/A'}</p>
            {/* MORE INFO HERE */}
        </div>
    );
};

export default UserInfo;
