import React from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button'

const UserInfo = ({ user }) => {
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
            <p>Name: {user ? `${user.first_name} ${user.last_name}` : 'Guest'}</p>
            <p>Email: {user ? user.email : 'N/A'}</p>
            {/* MORE INFO HERE */}
        </div>
    );
};

export default UserInfo;
