import React from "react";
import LoginForm from "../../components/Login";
import { Link } from "react-router-dom"; // Use Link for navigation
// import "../assets/styles/StyleSheet.css";

function LoginPage() {

  return (
    <div className="login-page">
      <div className="form">
        <div className="login">
          <div className="login-header">
            <h3>LOGIN</h3>
            <p>Enter your info to start scheduling!</p>
          </div>
        </div>
        <LoginForm />
        <p className="message">
          Not registered? <Link to="/auth/createaccount">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;