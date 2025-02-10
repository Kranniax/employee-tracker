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
// view all employees 
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
// Add a new department to database
async function addDepartment() {
  const department = await inquirer.prompt([
    {
      type: "input",
      name: "department",
      message: "Please enter a new department",
    },
  ]);

  try {
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params = [department.department];
    await db.query(sql, params);
    console.log(`${department.department} has been added to the database.`);
  } catch (err) {
    console.error(err);
  }
}

const selectedOption = async function ({ option }) {
  switch (option) {
    case "view all departments":
      await viewDepartments();
      break;
    case "view all roles":
      await viewRoles();
      break;
    case "view all employees":
      await viewEmployees();
      break;
    case "add a department":
      await addDepartment();
      break;
    default:
      break;
  }
  init();
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
