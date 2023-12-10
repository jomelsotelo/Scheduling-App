import React, { useState, useEffect } from "react";
import { Button, Nav } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const PortalNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("user-token");

        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;

          const response = await axios.get(`/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = response.data;
          setUser(userData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  const navigateToCalendar = () => {
    navigate("/calendar");
  };

  const navigateToUserProfile = () => {
    navigate("/user");
  };

  return (
    <React.Fragment>
      <Navbar bg="dark" expand="lg" className="navbar-dark">
        <Link
          to="/"
          className="navbar-brand glow-on-hover"
          style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0px 10px" }}
        >
          JoinIn
        </Link>
        <Nav className="ml-auto justify-content-center">
          <Nav.Link
            onClick={navigateToCalendar}
            style={{ fontSize: "1rem", margin: "5px 10px" }}
          >
            Calendar
          </Nav.Link>
        </Nav>
        <Container />
        <Navbar.Text>
          {isLoading && <span style={{ color: "#ccc" }}>Loading...</span>}
          {!isLoading && (
            <span>
              Signed in as:
              <span
                className="glow-on-hover"
                style={{ cursor: "pointer", color: "white", marginLeft: "5px" }}
                onClick={navigateToUserProfile}
              >
                {user?.first_name || "Guest"}
              </span>
            </span>
          )}
        </Navbar.Text>
        <Nav className="ml-auto">
          <Nav.Link>
            <Button className="btn-secondary" onClick={logout}>
              Log Out
            </Button>
          </Nav.Link>
        </Nav>
      </Navbar>
    </React.Fragment>
  );
};

export default PortalNavbar;
