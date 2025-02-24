import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import { EmployeeQueries } from "./lib/queries.js";
import cTable from "console.table";

const employee = new EmployeeQueries();

function displayBanner() {
  console.log(
    "\n" +
      chalk.green(
        figlet.textSync("Employee", {
          font: "Standard",
          horizontalLayout: "full",
        })
      ) +
      chalk.green(
        figlet.textSync("Tracker", {
          font: "Standard",
          horizontalLayout: "full",
        })
      ) +
      "\n"
  );
}

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
      break;
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
    case "Delete a department":
      await employee.deleteDepartment();
      break;
    case "Delete a role":
      await employee.deleteRole();
      break;
    case "Delete a employee":
      await employee.deleteEmployee();
      break;
    case "View the total utilized budget of a department":
      await employee.utilizedDepartmentBudget();
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
          "Delete a department",
          "Delete a role",
          "Delete a employee",
          "View the total utilized budget of a department",
          "exit",
        ],
      },
    ]);
    await selectedOption(option);
  } catch (err) {
    console.error("An error occurred:", err);
  }
};

// Usage:
displayBanner();
init();
