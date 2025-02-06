import inquirer from "inquirer";
// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test',
});

var init = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "selection",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ])
    .then((answers) => {
      console.log(answers);
    });
};

init();
