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
// Add a new department to the database
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
// Add a role
async function addRole() {
  try {
    // Get list of departments.
    const [departments] = await db.query(`SELECT id, name FROM department`);
    // console.log(departments);

    // Prompt user for role details.
    const role = await inquirer.prompt([
      {
        type: "input",
        name: "role",
        message: "Please enter the new role's name",
      },
      {
        type: "input",
        name: "salary",
        message: "Please enter the new role's salary",
        validate: (input) => {
          if (isNaN(input)) {
            return "Please enter a valid number";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "department",
        message: "Choose the department for this role",
        choices: departments.map((dept) => ({
          name: dept.name,
          value: dept.id,
        })),
      },
    ]);
    const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
    const params = [role.role, role.salary, role.department];

    await db.query(sql, params);
    console.log(`Added ${role.role} role to the database`);
  } catch (error) {
    console.log(error);
  }
}

async function addEmployee() {
  const [roles] = await db.query(`SELECT id, title FROM role`);
  const [managers] = await db.query(
    `SELECT id, CONCAT(first_name , ' ', last_name) AS manager_name FROM employee`
  );

  // console.log(roles);
  // console.log(managers);

  const employee = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "Please enter the employee's first name",
    },
    {
      type: "input",
      name: "last_name",
      message: "Please enter the employee's last name.",
    },
    {
      type: "list",
      name: "role",
      message: "Choose the role for this employee",
      choices: roles.map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
    {
      type: "list",
      name: "manager",
      message: "Choose the manager for this employee",
      choices: managers.map((manager) => ({
        name: manager.manager_name,
        value: manager.id,
      })),
    },
  ]);
  try {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                 VALUES (?,?,?,?)`;
    const params = [
      employee.first_name,
      employee.last_name,
      employee.role,
      employee.manager,
    ];

    await db.query(sql, params);
    console.log(
      `Added ${employee.first_name} ${employee.last_name} to the database.`
    );
  } catch (error) {
    console.log(error);
  }
}
// The selected option will trigger the different functions/queries.
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
    case "add a role":
      await addRole();
    case "add an employee":
      await addEmployee();
      break;
    default:
      break;
  }
  init();
};
// User prompts from the CLI.
var init = async () => {
  try {
    const option = await inquirer.prompt([
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
    ]);
    await selectedOption(option);
  } catch (err) {
    console.error("An error occurred:", err);
  }
};

init();
