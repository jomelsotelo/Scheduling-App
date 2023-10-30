import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function BasicExample() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default BasicExample;
//Testing js with two methods
function webNote() {
    alert("This website is to schedule on a calendar!");
}

function callNote() {
    return webNote();
}

//logging in 
//document.querySelector('#loginButton').addEventListener('click', login)

document.getElementById("loginOut").onclick = function () {
    location.replace("https://www.w3schools.com");
}
function login() {
    //let login = document.getElementById("loginButton");
    //location.href = "/index.html";
    location.replace("index.html")
    //<a href="index.html"></a>
    return true;
}

//Account verification for different username and password

function check() {

}

//Logout button Attempts
function logOut() {
    location.replace('login.html');
    //onclick = "location.href='login.html'";
    return true;
}
/*
document.getElementById("logOut").onclick = function () { toLogin() };

function toLogin() {
    window.location.href = "login.html";
};*/



