import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"

function CreateAccountForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your registration logic here
    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
    }
    // Perform registration actions (e.g., API call)
    axios
    .post("/users", userData)
    .then((response) => {
      console.log("Registration success:", response.data)
      navigate.push("/login")
    })
    .catch((error) => {
      console.error("Registration error:", error)
    })
  };

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
      />
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
      <button type="submit">Create Account</button>
    </form>
  );
}

export default CreateAccountForm;