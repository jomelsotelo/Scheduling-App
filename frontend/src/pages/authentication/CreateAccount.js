import React from "react";
import CreateAccountForm from "../../components/CreateAccountForm";
import "../../assets/styles/StyleSheet.css"; // Import your stylesheet

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
      </div>
    </div>
  );
}

export default CreateAccountPage;
