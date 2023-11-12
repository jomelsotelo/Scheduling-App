import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Welcome to the Scheduling App</h1>
      <h1>Calendar</h1>
      <Link to="/calendar">CLick here to start scheduling</Link>
      {/* Other content */}
    </div>
  );
}

export default HomePage;