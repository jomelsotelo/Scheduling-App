import React, { useState, useEffect} from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const submitLoginForm = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", formData);
      const data = response.data;
      const token = data.token;

      if (!token) {
        setErrorMessage('Invalid username or password.');
        setLoading(false);
        return;
      }

      localStorage.clear();
      localStorage.setItem('user-token', token);
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error) {
      setErrorMessage('Invalid username or password.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear error message on component mount
    setErrorMessage("");
  }, []);

  return (
    <form id="loginForm" onSubmit={submitLoginForm}>
      <input
        type="text"
        placeholder="Email"
        id="email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <input
        type="password"
        placeholder="Password"
        id="password"
        value={formData.password}
        onChange={handleInputChange}
      />
      <Button
        variant="primary"
        type="submit"
        id="loginButton"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
}

export default LoginForm;