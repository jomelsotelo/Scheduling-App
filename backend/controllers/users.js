import { v4 as uuidv4 } from 'uuid';
let users = [{
    "Fname": "joe",
    "Lname": "bruh",
    "age": 25
    },
    {
    "Fname": "jim",
    "Lname": "brown ",
    "age": 25
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
    res.send(foundUser);
 
};


export const createUser = (req, res) => {  
    const user = req.body;




    //random id created
    const userId=uuidv4();
    const userWithId = { ... user, id: userId}
    users.push(userWithId);




    res.send(`user with username ${user.Fname} added`);


};


export const updateUser =  (req,res) => {
  const {id} = req.params;
  const{ Fname,Lname,age} = req.body;
  const user= users.find((user)=> user.id === id);
  if (Fname || Lname || age) {
    if (Fname) user.Fname = Fname;
    if (Lname) user.Lname = Lname;
    if (age) user.age =age;
  }
   
res.send(`user with Id ${id} has been updated `)
};


export const deleteUser = (req, res) => {
    const {id} =req.params;
  users = users.filter((user) => user.id !== id);
  res.send (`user with id  ${id} has been deleted `);




};
