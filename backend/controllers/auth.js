import database from '../config/database.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { createUser } from './users.js'

//Register a new user.
export const registerUser = async (req, res) => {
    try {
        // Assuming user registration data is in the request body
        const userData = req.body
    
        // Call the createUser function from user.js to add the user to the database
        await createUser(userData)
    
        // If createUser is successful, you can send a response to the client
        res.status(201).send('User registered successfully')
      } catch (error) {
        console.error('Error registering user:', error)
        res.status(500).send('Server Error')
      }
  }

//Authenticate a new user.
export const authenticateUser = async (req, res) => {
    const { email, password } = req.body
  
    // Check if the user object contains the required fields
    if (!email || !password) {
      return res.status(400).send('Email and password are required.')
    }
  
    try {
      // Assuming you have a function to fetch user data from the database
      const user = await getUserByEmail(email)
  
      if (!user) {
        return res.status(401).send('Invalid email or password.')
      }
      // Compare the provided password with the stored hash
      const isValidPassword = await bcrypt.compare(password, user[0].password_hash)

      if (!isValidPassword) {
        return res.status(401).send('Invalid email or password.')
      }
  
      // If authentication is successful, generate a token
      const token = jwt.sign({ userId: user[0].user_id, email: user[0].email}, 'your-secret-key', {
        expiresIn: '1h', // You can adjust the token expiration time
      });
      
      res.json({ token })
    } catch (error) {
      console.error("Error authenticating user:", error)
      res.status(500).send('Server Error')
    }
  };
  
  const getUserByEmail = async (email) => {
    const query = 'SELECT user_id, email, password_hash FROM users WHERE email = ?'
    const [user] = await database.query(query, [email])
    return user
  };