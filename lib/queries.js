import { db } from "../db/connection.js";
import inquirer from "inquirer";
class EmployeeQueries {
  constructor(db) {
    this.db = db;
  }
  //View all departments.
  async viewDepartments() {
    // A simple SELECT query
    try {
      const [results] = await db.query(`SELECT * FROM department`);
      console.table(results); // results contains rows returned by server
    } catch (err) {
      console.log(err);
    }
  }
  // View all roles.
  async viewRoles() {
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
  async viewEmployees() {
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
  // Add a new department.
  async addDepartment() {
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
  async addRole() {
    try {
      // Get list of departments.
      const [departments] = await db.query(`SELECT id, name FROM department`);

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

  async addEmployee() {
    // Get a list of roles and managers.
    const [roles] = await db.query(`SELECT id, title FROM role`);
    const [managers] = await db.query(
      `SELECT id, CONCAT(first_name, ' ',last_name) AS manager_name FROM employee`
    );

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
        `Added ${employee.first_name}${employee.last_name} to the database.`
      );
    } catch (error) {
      console.log(error);
    }
  }
  // Update an employee's role.
  async updateEmployeeRole() {
    const [employees] = await db.query(
      `SELECT id, CONCAT(first_name , ' ', last_name) AS employee FROM employee`
    );
    const [roles] = await db.query(`SELECT id, title FROM role`);

    const updatedEmployee = await inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Select an employee to update their role",
        choices: employees.map((employee) => ({
          name: employee.employee,
          value: employee.id,
        })),
      },
      {
        type: "list",
        name: "role",
        message: "Select an updated role for this employee",
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
    ]);
    try {
      const sql = `UPDATE employee
                 SET employee.role_id=?
                 WHERE employee.id = ? `;
      const params = [updatedEmployee.role, updatedEmployee.employee];
      await db.query(sql, params);
    } catch (error) {
      console.log(error);
    }
  }
  // Update employee manager.
  async updateEmployeeManager() {
    const [employees] = await db.query(
      `SELECT id, CONCAT(first_name , ' ', last_name) AS employee FROM employee `
    );
    // First prompt - select employee
    const employeeSelection = await inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Select an employee to update their manager.",
        choices: employees.map((employee) => ({
          name: employee.employee,
          value: employee.id,
        })),
      },
    ]);
    // Second prompt - select manager (excluding the selected employee)
    const managerSelection = await inquirer.prompt([
      {
        type: "list",
        name: "manager",
        message: "Select a manager to update the selected employee.",
        choices: employees
          .filter((emp) => emp.id != employeeSelection.employee)
          .map((employee) => ({
            name: employee.employee,
            value: employee.id,
          })),
      },
    ]);

    try {
      const sql = `UPDATE employee
                   SET manager_id = ? 
                   WHERE id = ?`;
      const params = [managerSelection.manager, employeeSelection.employee];

      const [result] = await db.query(sql, params);

      if (result.affectedRows > 0) {
        console.log("Employee's manager updated successfully!");
      } else {
        console.log("No changes were made.");
      }
    } catch (error) {
      console.log("Error updating employee's manager:", error.message);
    }
  }
}

export { EmployeeQueries };
