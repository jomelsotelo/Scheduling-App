import mysql from "mysql2/promise";
import dotenv from 'dotenv'
dotenv.config()

const database = await mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Roblox123!',
  database: 'scheduling',
});

export default database;