require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const mysql = require('mysql2/promise');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'May12003M%',
  database: 'scheduling',
});

const commandPrefix = '!';

client.on('messageCreate', async (message) => {
    // Check if the message starts with the command prefix
    if (message.content.startsWith(commandPrefix)) {
      // Extract the command and arguments
      const [command, ...args] = message.content.slice(commandPrefix.length).split(' ');
  
      // Check for the !getUsers command
      if (command === 'getUsers') {
        try {
          const [rows] = await db.execute('SELECT * FROM users');
          
          // Check if there are rows in the result
          if (rows.length > 0) {
            // Map the rows to a formatted string
            const formattedData = rows.map(row => `First Name: ${row.first_name}, Last Name: ${row.last_name}, email: ${row.email}, ID: ${row.user_id}`).join('\n');
            
            // Reply with the formatted data
            message.reply(`Data read successfully:\n${formattedData}`);
          } else {
            // Message displays if database is empty.
            message.reply('No data found in the database.');
          }
        } catch (error) {
          console.error(error);
          message.reply('Error retrieving data from database.');
        }
        //Retrieve user availability through the discord bot.
      } else if (command === 'getUserAvailability'){
        try {
            const [rows] = await db.execute('SELECT * FROM user_availability');
            
            // Check if there are rows in the result
            if (rows.length > 0) {
              // Map the rows to a formatted string
              const formattedData = rows.map(row => `User ID: ${row.user_id}, Start Time: ${row.start_time}, End Time: ${row.end_time}`).join('\n');
              
              // Reply with the formatted data
              message.reply(`Data read successfully:\n${formattedData}`);
            } else {
              message.reply('No data found in the database.');
            }
          } catch (error) {
            console.error(error);
            message.reply('Error retrieving data from database.');
          }
          // Check for the !getMeetings command by 
      } else if (command === 'getMeetings'){
        try {
            const [rows] = await db.execute('SELECT * FROM meetings');
            
            // Check if there are rows in the result
            if (rows.length > 0) {
              // Map the rows to a formatted string
              const formattedData = rows.map(row => `Meeting Title: ${row.title}, Scheduled Time: ${row.scheduled_time}, Meeting Duration: ${row.duration}`).join('\n');
              
              // Reply with the formatted data
              message.reply(`Data read successfully:\n${formattedData}`);
            } else {
              message.reply('No data found in the database.');
            }
          } catch (error) {
            console.error(error);
            message.reply('Error retrieving data from database.');
          }
      } else if (command === 'getMeetings'){
        try {
            const [rows] = await db.execute('SELECT * FROM meetings');
            
            // Check if there are rows in the result
            if (rows.length > 0) {
              // Map the rows to a formatted string
              const formattedData = rows.map(row => `Meeting Title: ${row.title}, Scheduled Time: ${row.scheduled_time}, Meeting Duration: ${row.duration}`).join('\n');
              
              // Reply with the formatted data
              message.reply(`Data read successfully:\n${formattedData}`);
            } else {
              message.reply('No data found in the database.');
            }
          } catch (error) {
            console.error(error);
            message.reply('Error retrieving data from database.');
          }
      }
  
      // Add other commands as needed.
    }
  });
  

client.login(process.env.TOKEN);