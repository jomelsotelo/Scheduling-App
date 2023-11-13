import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
const AuthNavbar = () => {
    return (
        <React.Fragment>
            <Navbar bg="dark" expand="lg" className="navbar-dark">
            <Container>
                <Nav className = "mx-auto">
                    <Navbar.Brand style={{ fontSize: "1.5rem" , fontWeight: "bold"}}>JoinIn</Navbar.Brand>
                </Nav>
            </Container>
            </Navbar>
        </React.Fragment>
    );
}
export default AuthNavbar;