import inquirer from "inquirer";
import { EmployeeQueries } from "./lib/queries.js";
import cTable from "console.table";

const employee = new EmployeeQueries();

// The selected option will trigger the different functions/queries.
const selectedOption = async function ({ option }) {
  switch (option) {
    case "view all departments":
      await employee.viewDepartments();
      break;
    case "view all roles":
      await employee.viewRoles();
      break;
    case "view all employees":
      await employee.viewEmployees();
      break;
    case "add a department":
      await employee.addDepartment();
      break;
    case "add a role":
      await employee.addRole();
    case "add an employee":
      await employee.addEmployee();
      break;
    case "update an employee role":
      await employee.updateEmployeeRole();
      break;
    case "update an employee manager":
      await employee.updateEmployeeManager();
      break;
    case "view all employees by manager":
      await employee.viewEmployeesByManager();
      break;
    case "view all employees by department":
      await employee.viewEmployeesByDepartment();
      break;
    case "exit":
      console.log("Goodbye!");
      process.exit(0);
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
          "update an employee manager",
          "view all employees by manager",
          "view all employees by department",
          "exit",
        ],
      },
    ]);
    await selectedOption(option);
  } catch (err) {
    console.error("An error occurred:", err);
  }
};

init();
