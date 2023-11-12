import database from '../config/database.js';
import bcrypt from 'bcryptjs'
//USER MANAGEMENT

//Create a new user.
export const createUser = async (req, res) => {
  const user = req.body; // Assuming user data is in the request body
  // Check if the user object contains the required fields
  if (
    !user.first_name ||
    !user.last_name ||
    !user.email ||
    !user.password
  ) {
    return res.status(400).send('All required fields must be provided.');
  }

  try {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(user.password, saltRounds);
    const query = `INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)`;
    const values = [
      user.first_name,
      user.last_name,
      user.email,
      password_hash,
    ];
    const result = await database.query(query, values);

    //instead of printing  user has been added it outputs failed to create user
    if (result.affectedRows === 0) {
      res.status(500).send('Failed to create a user.');
    } else {

      res.send(`User with email ${user.email} added`);
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send('Server Error');
  }
};

//Retrieve user profile information.
export const getUser = async(req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await database.query("SELECT * FROM users WHERE user_id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).send(`User with ID ${id} not found.`);
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send('Server Error');
  }
};

//Retrieve all user data.
export const getUsers = async (req, res) => {
  try {
    const [rows] = await database.query("SELECT * FROM users");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send('Server Error');
  }
}

//Edit user info.
export const editUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, salt, password_hash } = req.body;

  // Check if the user object contains the required fields
  if (!first_name || !last_name || !email || !password_hash) {
    return res.status(400).send('All required fields must be provided.');
  }

  try {
    // Update user data in the database
    const query = `UPDATE users SET first_name = ?, last_name = ?, email = ?, password_hash = ? WHERE user_id = ?`;
    const values = [first_name, last_name, email, password_hash, id];
    const result = await database.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).send(`User with ID ${id} not found.`);
    }
    res.status(200).send(`User with ID ${id} has been updated.`);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send('Server Error');
  }
}

//Delete user.
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
      const result = await database.query("DELETE FROM users WHERE user_id = ?", [id]);

      if (result.affectedRows === 0) {
          return res.status(404).send(`User with ID ${id} not found.`);
      }
      res.send(`User with ID ${id} has been deleted.`);
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send('Server Error');
  }
}
