import database from '../config/database.js';




//gets all users
export const getUsers = async (req, res) => {
  try {
    const [rows] = await database.query("SELECT * FROM users");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send('Server Error');
  }
}



//get one user
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




//Create a new user
export const createUser = async (req, res) => {
  const user = req.body;
  // Validate user data here
  try {
      // Insert user into the database
      const query = "INSERT INTO users (first_name, last_name, email, salt, password_hash) VALUES (?, ?, ?, ?, ?)";
      const values = [user.first_name, user.last_name, user.email, user.salt, user.password_hash];
     
      const result = await database.query(query, values);


      if (result.affectedRows === 1) {
          res.send(`User with email ${user.email} added`);
      } else {
          res.status(500).send('Failed to create a user.');
      }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send('Server Error');
  }
};//updates a user with put




export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, salt, password_hash } = req.body;


  // Check if the user object contains the required fields
  if (!first_name || !last_name || !email || !salt || !password_hash) {
    return res.status(400).send('All required fields must be provided.');
  }


  try {
    // Update user data in the database
    const query = `UPDATE users SET first_name = ?, last_name = ?, email = ?, salt = ?, password_hash = ? WHERE user_id = ?`;
    const values = [first_name, last_name, email, salt, password_hash, id];
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


//Deletes user with delete
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
//USER MANAGEMENT




// //Create a new user.
// createUser
INSERT INTO 

// //Retrieve user profile information.
// getUserProfile




// //Retrieve all user data.
// getUserData




// //Edit user info.
// editUserInfo




// //Delete user.
// deleteUser
