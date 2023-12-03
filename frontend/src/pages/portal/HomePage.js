import React from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button'

function HomePage() {
  return (
    <div className="home-page">
      <div className="home-content">
        <h1>Welcome to Our Scheduling App!</h1>
        <p>
          Our scheduling app helps you manage your time efficiently by providing
          a user-friendly platform for creating and organizing your schedule.
          Whether you're a student, professional, or anyone looking to stay
          organized, our app has you covered.
        </p>
        <h2>Key Features:</h2>
        <ul>
          <li>Easy schedule creation and customization.</li>
          <li>Set reminders for important events.</li>
          <li>View your schedule at a glance with a clean and intuitive interface.</li>
        </ul>
        <p>
          Get started today and take control of your time!
        </p>
        <Link to="/calendar">
          <Button className="button-link" variant="primary" size="lg">
            Get Started!
          </Button>{' '}
        </Link>
      </div>
      <div className="home-content2"></div>
    </div>
  );
}

export default HomePage;