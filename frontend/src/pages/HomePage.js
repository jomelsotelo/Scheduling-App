import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Welcome to the Scheduling App</h1>
      <Link to="/createaccount">Create Account</Link>
      <h1>Login</h1>
      <Link to="/login">CLick here</Link>
      <h1>Calendar</h1>
      <Link to="/calendar">CLick here</Link>
      {/* Other content */}
    </div>
  );
}

export default HomePage;