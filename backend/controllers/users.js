import { v4 as uuidv4 } from 'uuid';
let users = [{
    "Fname": "joe",
    "Lname": "bruh",
    "age": 25,
    'id': "1egfd213dg1s3-gs2c145"
    },
    {
    "Fname": "jim",
    "Lname": "brown ",
    "age": 25,
    "id": "4fdsagfsd-cdsfse-4r5t"
    }
]


//gets all users
export const getUsers = (req, res) => {
    console.log(users);
    res.send(users);
}


//get one user
export const getUser = (req, res) => {
    const {id}= req.params;
    const foundUser = users.find((user) => user.id === id);
 
    //404 error
    /*if (!foundUser) {
     
      // If the user is not found, return a 404 Not Found response.
      return res.status(404).send(`404 Not Found`);
    }*/


    res.send(foundUser);
   
 
};


//creates a user with post
export const createUser = (req, res) => {  
    const user = req.body;


    // Check the Content-Type of the request.
    const contentType = req.get('Content-Type');
   
    if (contentType !== 'application/json') {
        // If the Content-Type is not JSON, return a 415 Unsupported Media Type error.
        return res.status(415).send('Error 415. Response must be in JSON');
    }


    //random id created
    const userId=uuidv4();
    const userWithId = { ... user, id: userId}
    users.push(userWithId);




    res.send(`user with username ${user.Fname} added`);


};


//updates a user with put
export const updateUser =  (req,res) => {
  const {id} = req.params;
  const{ Fname,Lname,age} = req.body;
  const user= users.find((user)=> user.id === id);


  //404 error
  if (!user) {
    // If the user is not found, return a 404 Not Found response.
    return res.status(404).send(`404 Not Found. User with Id ${id} not found.`);
  }


  //415 error if contentType is no JSON
  if (contentType !== 'application/json') {
    // If the Content-Type is not JSON, return a 415 Unsupported Media Type error.
    return res.status(415).send('Unsupported Media Type. Please send data in JSON format.');
}


  if (Fname || Lname || age) {
    if (Fname) user.Fname = Fname;
    if (Lname) user.Lname = Lname;
    if (age) user.age = age;


    // Return a 200 OK response to indicate a successful update.
    return res.status(200).send(`User with Id ${id} has been updated.`);
  } else {
    // If no data was provided to update, return a 400 Bad Request response.
    return res.status(400).send('Invalid request data. Please provide data to update the user.');
  }
};


//Deletes user with delete
export const deleteUser = (req, res) => {
  const {id} =req.params;


  const userIndex = users.findIndex((user) => user.id === id);


  if (userIndex === -1) {
    // If the user is not found, return a 404 Not Found response.
    return res.status(404).send(`User with Id ${id} not found.`);
  }




  users = users.filter((user) => user.id !== id);
  res.send (`user with id  ${id} has been deleted `);




};


