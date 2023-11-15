import React from "react";
import { Button, Nav } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom"
const PortalNavbar = () => {
    const navigate = useNavigate()
    
    const logout = () => {
        localStorage.clear()
        navigate('/auth/login')
    }
    const navigateToCalendar = () => {
        navigate('/calendar')
    }
    const navigateToHome = () => {
        navigate('/')
    }

    return (
        <React.Fragment>
            <Navbar bg="dark" expand="lg" className="navbar-dark">
                <Nav className="ml-auto justify-content-center">
                <Navbar.Brand style={{ fontSize: "1.5rem" , fontWeight: "bold", margin: '0px 10px'}}>JoinIn</Navbar.Brand>
                <Nav.Link onClick={navigateToHome} style={{ fontSize: '1rem', margin: '5px 10px' }}>Home</Nav.Link>
                <Nav.Link onClick={navigateToCalendar} style={{ fontSize: '1rem', margin: '5px 5px' }}>Calendar</Nav.Link>
                </Nav>
                <Container />
                <Nav className="ml-auto">
                    <Nav.Link>
                        <Button className="btn-secondary" onClick={logout}>Log Out</Button>
                    </Nav.Link>
                </Nav>
            </Navbar>
        </React.Fragment>
    )
}
export default PortalNavbar