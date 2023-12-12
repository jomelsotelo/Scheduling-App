import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import Button from 'react-bootstrap/Button';

function AccountInfo() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
  });

  const [isLoading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null); // State to store user ID

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("user-token");
        if (!token) {
          console.error("User token not found");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userIdFromToken = decodedToken.userId; // Assuming the token has userId information

        setUserId(userIdFromToken);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.password,
      };

      const token = localStorage.getItem("user-token");
      const response = await axios.put(`/api/users/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Update success:", response.data);
      setSuccessMessage("Account information updated successfully!");
      setErrorMessage(""); // Clear any previous error messages
      setLoading(false);
    } catch (error) {
      console.error("Update error:", error);
      setSuccessMessage(""); // Clear any previous success messages
      setErrorMessage("Update failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="edit-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
        />
        <input
          type="password"
          placeholder="New Password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update'}
        </Button>
      </form>
      {successMessage && (
        <p className="success-message" style={{ color: 'green' }}>
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="error-message" style={{ color: 'red' }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default AccountInfo;
