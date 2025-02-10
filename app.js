import inquirer from "inquirer";
// Get the client
import mysql from "mysql2/promise";
import cTable from "console.table";

// Create the connection to database
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@Pizza231996",
  database: "employee_tracker",
});
//View all departments query.
async function viewDepartments() {
  // A simple SELECT query
  try {
    const [results] = await db.query(`SELECT * FROM department`);
    console.table(results); // results contains rows returned by server
  } catch (err) {
    console.log(err);
  }
}

async function viewRoles() {
  // A simple SELECT query
  try {
    const [results] =
      await db.query(`SELECT role.id, role.title, role.salary, department.name AS department_name
                                      FROM role
                                      LEFT JOIN department 
                                      ON role.department_id = department.id;
                                      `);
    console.table(results); // results contains rows returned by server
  } catch (err) {
    console.log(err);
  }
}

async function viewEmployees() {
  // A simple SELECT query
  try {
    const [results] = await db.query(`SELECT 
                                        employee.id, 
                                        employee.first_name, 
                                        employee.last_name,
                                        role.title AS job_title, 
                                        department.name AS department,
                                        role.salary,
                                        CONCAT(m.first_name , ' ', m.last_name) AS manager 
                                        FROM employee
                                        LEFT JOIN role on employee.role_id = role.id
                                        LEFT JOIN department on role.department_id = department.id
                                        LEFT JOIN employee m on employee.manager_id = m.id
                                        `);
    console.table(results); // results contains rows returned by server
  } catch (err) {
    console.log(err);
  }
}

// function addDepartment() {
//   inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "department",
//         message: "Please enter a new deparment",
//       },
//     ])
//     .then((department) => {

//       const sql = `INSERT INTO department (name) VALUES (?)`;
//       const params = [department.department];
//       db.query(sql, params, (err, result) => {
//         if (err) throw err;
//         console.log(
//           `${department.department} has beed added to the department table database.`
//         );
//       });
//     });
// }

var selectedOption = function ({ option }) {
  switch (option) {
    case "view all departments":
      viewDepartments();
      break;
    case "view all roles":
      viewRoles();
      break;
    case "view all employees":
      viewEmployees();
      break;
    // case "add a department":
    //   addDepartment();
    //   break;

    default:
      break;
  }
};

var init = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message: "What would you like to do?",
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
    .then((option) => {
      selectedOption(option);
    });
};

init();
