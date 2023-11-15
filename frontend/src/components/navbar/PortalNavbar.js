import React, { useState, useEffect} from "react"
import { Button, Nav } from "react-bootstrap"
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import { useNavigate } from "react-router-dom"
import { useParams } from 'react-router-dom'
import axios from 'axios'

const PortalNavbar = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const { id } = useParams()
    
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            // Get the token from local storage
            const token = localStorage.getItem('user-token')
    
            if (token) {
              // Send a request to the server to get user data
              const response = await axios.get('/api/users/${id}', {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
    
              // Assuming the server responds with user data
              const userData = response.data;
    
              // Update the state to store the user data
              setUser(userData)
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            // Handle error
          }
        }
    
        // Call the function to fetch user data when the component mounts
        fetchUserData()
      }, [id])

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
                <Navbar.Text>
                    Signed in as: {user?.first_name || 'Guest'}
                </Navbar.Text>
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