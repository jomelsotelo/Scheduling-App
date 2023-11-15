import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Button from 'react-bootstrap/Button'

function CreateAccountForm() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [isLoading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
    }
    setLoading(true)

    // Perform registration actions (e.g., API call)
    axios
    .post("/api/users", userData)
    .then((response) => {
      console.log("Registration success:", response.data)
      setSuccessMessage("Account created successfully!")
      setErrorMessage("") // Clears any previous error messages
      setTimeout(() => {
        setLoading(false);
        navigate("/auth/login");
      }, 2000);
    })
    .catch((error) => {
      console.error("Registration error:", error)
      setSuccessMessage("") // Clear any previous success messages
      setErrorMessage("Registration failed. Please try again.")
      setLoading(false)
    })
  }

  return (
    <div>
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
      <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
    </form>
    {successMessage && <p className="success-message" style={{color:'green'}}>{successMessage}</p>}
    {errorMessage && <p className="error-message" style={{color:'red'}}>{errorMessage}</p>}
    </div>
  )
}

export default CreateAccountForm