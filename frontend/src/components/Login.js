import React, { useState, useEffect} from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom"

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
    const btnPointer = document.querySelector('#loginButton');
    btnPointer.innerHTML = 'Please wait..';
    btnPointer.setAttribute('disabled', true);

    try {
      const response = await axios.post("/auth/login", formData);
      const data = response.data;
      const token = data.token;

      if (!token) {
        setErrorMessage('Invalid username or password.');
        btnPointer.innerHTML = 'Login';
        btnPointer.removeAttribute('disabled');
        return;
      }

      localStorage.clear();
      localStorage.setItem('user-token', token);
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error) {
      setErrorMessage('Oops! Some error occurred.');
      btnPointer.innerHTML = 'Login';
      btnPointer.removeAttribute('disabled');
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
        placeholder="email"
        id="email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <input
        type="password"
        placeholder="password"
        id="password"
        value={formData.password}
        onChange={handleInputChange}
      />
      <button type="submit" id="loginButton">
        Login
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
}

export default LoginForm;