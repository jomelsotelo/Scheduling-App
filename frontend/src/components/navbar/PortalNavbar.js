import React, { useState, useEffect} from "react"
import { Button, Nav } from "react-bootstrap"
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const PortalNavbar = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            // Get the token from local storage
            const token = localStorage.getItem('user-token')
    
            if (token) {
              const decodedToken = jwtDecode(token)
              const userId = decodedToken.userId
              // Send a request to the server to get user data
              const response = await axios.get(`/api/users/${userId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
    
              // Assuming the server responds with user data
              const userData = response.data;
              // Update the state to store the user data
              setUser(userData)
              setIsLoading(false)
            }
          } catch (error) {
            console.error('Error fetching user data:', error)
            // Handle error
          }
        }
    
        // Call the function to fetch user data when the component mounts
        fetchUserData()
      }, [])

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
    const navigateToAccount = () => {
      navigate ('/account')
    }

    return (
        <React.Fragment>
            <Navbar bg="dark" expand="lg" className="navbar-dark">
                <Nav className="ml-auto justify-content-center">
                <Navbar.Brand style={{ fontSize: "1.5rem" , fontWeight: "bold", margin: '0px 10px'}}>JoinIn</Navbar.Brand>
                <Nav.Link onClick={navigateToHome} style={{ fontSize: '1rem', margin: '5px 10px' }}>Home</Nav.Link>
                <Nav.Link onClick={navigateToCalendar} style={{ fontSize: '1rem', margin: '5px 5px' }}>Calendar</Nav.Link>
                <Nav.Link onClick={navigateToAccount} style={{ fontSize: '1rem', margin: '5px 5px' }}>Account</Nav.Link>
                </Nav>
                <Container />
                <Navbar.Text>
                  {isLoading && <span style={{ color: '#ccc' }}>Loading...</span>}
                  {!isLoading && <span>Signed in as: {user?.first_name || 'Guest'}</span>}
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