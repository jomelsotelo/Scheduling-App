import React from "react";
import { Button, Nav } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'
import { useNavigate } from "react-router-dom";
const PortalNavbar = () => {
    const navigate = useNavigate();
    
    const logout = () => {
        localStorage.clear();
        navigate('/auth/login');
    }
    const navigateToCalendar = () => {
        navigate('/calendar');
    }
    const navigateToAgenda = () => {
        navigate('/agenda');
    }
    const navigateToHome = () => {
        navigate('/');
    }

    return (
        <React.Fragment>
            <Navbar bg="dark" expand="lg" className="navbar-dark">
                <Container>
                <Nav className = "ms">
                <Navbar.Brand style={{ fontWeight: "bold"}}>JoinIn</Navbar.Brand>
                    <Nav.Link onClick={navigateToHome}>Home</Nav.Link>
                    <Nav.Link onClick={navigateToCalendar}>Calendar</Nav.Link>
                    <Nav.Link onClick={navigateToAgenda}>Agenda</Nav.Link>
                </Nav>
                </Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="More" id="basic-nav-dropdown">
                            <Nav.Link>
                                <Button className="btn-secondary" onClick={logout}>Settings</Button>
                            </Nav.Link>
                            <Nav.Link>
                                <Button className="btn-secondary" onClick={logout}>Log Out</Button>
                            </Nav.Link>
                        </NavDropdown>
                    </Nav>
                        <Nav className="ms-auto">
                        </Nav>
                    </Navbar.Collapse>
            </Navbar>
        </React.Fragment>
    );
}
export default PortalNavbar;