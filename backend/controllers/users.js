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
}




//updates a user with put
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { Fname, Lname, age } = req.body;
  const contentType = req.get('Content-Type'); // Get the content type from headers


  if (!contentType || contentType !== 'application/json') {
      return res.status(415).send('Unsupported Media Type. Please send data in JSON format.');
  }


  try {
      // Update user data in the database
      const result = await database.query("UPDATE users SET Fname = ?, Lname = ?, age = ? WHERE id = ?", [Fname, Lname, age, id]);


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
      const result = await database.query("DELETE FROM users WHERE id = ?", [id]);


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


// //Retrieve user profile information.
// getUserProfile


// //Retrieve all user data.
// getUserData


// //Edit user info.
// editUserInfo


// //Delete user.
// deleteUser
