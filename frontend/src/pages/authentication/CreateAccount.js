import React from "react";
import CreateAccountForm from "../../components/CreateAccountForm";
import { Link } from "react-router-dom";

function CreateAccountPage() {
  return (
    <div className="create-page">
      <div className="form">
        <div className="login">
          <div className="create-header">
            <h3>Create Your Account!</h3>
            <p>Enter your info below to start!</p>
          </div>
        </div>
        <CreateAccountForm />
        <p className="message">
          Already have an account? <Link to="/auth/login">Login here!</Link>
        </p>
      </div>
    </div>
  );
}

export default CreateAccountPage;
