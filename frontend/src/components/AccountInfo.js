import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import Button from 'react-bootstrap/Button';

function EditAccount() {
  const [user, setUser] = useState(null);
  const { id } = useParams(); // Get the user ID from the URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
  });

  const [isLoading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Call the function to fetch user data when the component mounts
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Gets the token from local storage
      const token = localStorage.getItem("user-token");

      if (token) {
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const userDataResponse = await axiosInstance.get(`/api/users/${userId}`);
        const userData = userDataResponse.data;

        // Updates the state to store the user data
        setUser(userData);
        console.log(user.userId);
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          password: userData.password,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const editUser = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
    };

    setLoading(true);

    // Perform account update actions (e.g., API call)
    axios.put(`/api/user/${id}`, editUser)
      .then((response) => {
        console.log("Edit was success:", response.data);
        setSuccessMessage("Account edited successfully!");
        setErrorMessage(""); // Clears any previous error messages
        setTimeout(() => {
          setLoading(false);
          navigate(`/user/${id}`); // Redirect to user profile after successful edit
        }, 2000);
      })
      .catch((error) => {
        console.error("Edit error:", error);

        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received from the server.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up the request:", error.message);
        }

        setSuccessMessage(""); // Clear any previous success messages
        setErrorMessage("Edit failed. Please try again.");
        setLoading(false);
      });
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
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />

        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Editing Account...' : 'Save Account Info'}
        </Button>
      </form>
      {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default EditAccount;
