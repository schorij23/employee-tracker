const inquirer = require('inquirer')
const mysql = require('mysql2')
const figlet = require("figlet");

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'J9gRH4K$Wy4ju%qd10A6',
  database: 'employee_tracker'
});


// Connect to the database
connection.connect(function (err) {
  // Handle the error if there is one
  if (err) {
    console.error('error connecting');
    // Stop connection if there is an error
    return;
  }
  // Other wise log connected and start the database
  console.log('connected');
  startDb();
});
// Generates ASCII art using big font style
figlet("Employee Tracker", { font: 'Big' }, function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});
// Function to start the Database an prompt user options
function startDb() {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: [
          'View all departments', 'View all roles', 'View all employees',
          'Add a department', 'Add a role', 'Add an employee',
          'Update an employee role', 'Quit the App',
        ],
      },
    ])
    // Handles the combination of SQL queries and Inquirer Prompts 
    .then((userChoice) => {
      if (userChoice.options === 'View all departments') {
        return viewAllDepartments();
      } else if (userChoice.options === 'View all roles') {
        return viewAllRoles();
      } else if (userChoice.options === 'View all employees') {
        return viewAllEmployees();
      } else if (userChoice.options === 'Add a department') {
        return promptForDepartmentInfo().then((answers) => addDepartment(answers.departmentName));
      } else if (userChoice.options === 'Add a role') {
        return promptForRoleInfo().then((answers) => addRole(answers.title, answers.salary, answers.departmentId));
      } else if (userChoice.options === 'Add an employee') {
        return promptForEmployeeInfo().then((answers) => addEmployee(answers.first_name, answers.last_name, answers.role_id, answers.manager_id));
      } else if (userChoice.options === 'Update an employee role') {
        return promptForUpdateEmployeeRoleInfo().then(updateEmployeeRole);
      } else if (userChoice.options === "Quit the App") {
        return process.exit();
      }
    })
    .then(() => {
      startDb()

    })
    .catch((error) => {
      console.error('There was an error:', error);
    });
}

// Function to view all departments
function viewAllDepartments() {
  // Create a asynchronous promise using resolve and reject to handle the results
  return new Promise((resolve, reject) => {
    // Select All from Depertaments
    connection.query('SELECT * FROM department', (err, results) => {
      // If there is an error reject the query
      if (err) {
        console.error('Error querying departments:', err);
        reject(err);
        // Otherwise Return the Results
      } else {
        console.table(results);
        resolve(results);
      }
    });
  });
}

// Function to view all roles
function viewAllRoles() {
  // SQL query to select role details and department names
  const sql = `
  SELECT r.id, r.title, d.name AS department, r.salary
  FROM role AS r
  JOIN department AS d ON r.department_id = d.id
`;
  // Create a asynchronous promise using resolve and reject to handle the results
  return new Promise((resolve, reject) => {
    // Execute the SQL query using the connection
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error querying roles:', err);
        reject(err);
      } else {
        // Shows results in a table
        console.table(results);
        resolve(results);
      }
    });
  });
}

// Function to view all employees in the database
function viewAllEmployees() {
  // SQL query to fetch employee data and include with role, department, and manager information
  const sql = `
  SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
  CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
  FROM employee 
  LEFT JOIN role on employee.role_id = role.id 
  LEFT JOIN department on role.department_id = department.id 
  LEFT JOIN employee manager on manager.id = employee.manager_id;`;

  return new Promise((resolve, reject) => {

    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error querying employees:', err);
        reject(err);
      } else {
        // Show results in a table form
        console.table(results);
        resolve(results);
      }
    });
  });
}
// Function to prompt to add a department
function promptForDepartmentInfo() {
  // Create a asynchronous promise using resolve and reject to handle the results
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'departmentName',
          message: 'Enter the department name:',
        },
      ])
      .then((answers) => {
        resolve(answers);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Function to add a new department to the database
function addDepartment(name) {
  return new Promise((resolve, reject) => {
    // SQL query to insert a new department with the name
    const sql = 'INSERT INTO department (name) VALUES (?)';
    connection.query(sql, [name], (err, results) => {
      if (err) {
        console.error('Error adding department:', err);
        reject(err);
      } else {
        // If the database operation is successful, log a success message
        console.log(`Department '${name}' added successfully.`);
        resolve(results);
      }
    });
  });
}
//  Variable to store an array of department name and Id
var allDepartmentNames = [];
// Function to get all the departments
function getAllDepartments() {
  //  SQL query to select department names and IDs from department table 
  connection.query('SELECT name,id FROM department', (err, results) => {
    if (err) {
      console.error('Error querying departments:', err);
      reject(err);
    } else {
      // Loop through results and populate the allDepartmentNames array
      for (let index = 0; index < results.length; index++) {
        const element = results[index];
        // console.log(element);
        allDepartmentNames.push({ name: element.name, value: element.id });

      }
    }

  });
}
// Function to prompt for role information
async function promptForRoleInfo() {
  // Call function to get all departments
  getAllDepartments();
  return new Promise((resolve, reject) => {
    // Choices for allDepartmentNames from get all departments array
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the role title:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the role salary:',
        },
        {
          type: 'list',
          name: 'departmentId',
          message: 'Enter the department ID for this role:',
          choices: allDepartmentNames,
        },
      ])
      .then((answers) => {

        resolve(answers);

      })
      .catch((error) => {
        reject(error);
      });
  });
}


// Function to add a role to database
function addRole(title, salary, department_id) {
  // Create a asynchronous promise using resolve and reject to handle the results
  return new Promise((resolve, reject) => {
    // SQL query to insert a new role into the role table
    const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    connection.query(sql, [title, salary, department_id], (err, results) => {
      if (err) {
        console.error('Error adding role:', err);
        reject(err);
      } else {
        console.log(`Role '${title}' added successfully.`);
        resolve(results);
      }
    });
  });
}

// Array to store role names and IDs
var allRoleNames = [];
// Function to get All Roles
function getAllRoles() {
  // Query the 'role' table to get role IDs and titles
  connection.query('SELECT id, title FROM role', (err, results) => {
    if (err) {
      console.error('Error querying roles:', err);
      reject(err);
    } else {
      // Loop through the results and populate the allRoleNames array
      for (let index = 0; index < results.length; index++) {
        const element = results[index];
        console.log(element);
        allRoleNames.push({ name: element.title, value: element.id });

      }
    }

  });
}
// Array to store information about all employees
var allEmployeeNames = [];
// Function to get all employee
function getAllEmployees() {
  // Query to select the first_name, last_name, and id columns from the employee table
  connection.query('SELECT first_name, last_name, id FROM employee', (err, results) => {

    if (err) {
      console.error('Error querying roles:', err);
      reject(err);

    } else {
      // Loop through the results and populate the allEmployeeNames array
      for (let index = 0; index < results.length; index++) {
        const element = results[index];
        console.log(element);
        allEmployeeNames.push({ name: `${element.first_name} ${element.last_name}`, value: element.id });

      }
    }

  });
}

// Function to prompt for employee information
async function promptForEmployeeInfo() {
  // Call functions to get all roles and employees
  getAllRoles();
  getAllEmployees();
  var managerChoices = allEmployeeNames;
  // Give the option to chose no manager_id for the employee added
  managerChoices.push({ name: 'None', value: null});
  return inquirer
  // Choices for allRoleNames and manager choices arrays
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the employee\'s first name:',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the employee\'s last name:',
      },
      {
        type: 'list',
        name: 'role_id',
        message: "Enter the employee\'s role_id",
        choices: allRoleNames,
      },
      {
        
        type: 'list',
        name: 'manager_id',
        message: 'Enter the manager\'s name for this employee (or choose None):',
        choices: managerChoices,
      },
    ])
    .then((answers) => {
      console.log(answers)
      return answers;
    })
    .catch((error) => {
      throw new Error(error);
    });
}
// Function to add an employee
function addEmployee(first_name, last_name, role_id, manager_id) {
  // Create a asynchronous promise using resolve and reject to handle the results
  return new Promise((resolve, reject) => {
    console.log(manager_id);
    // Query to insert a new employee into the employee table
    const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    // Execute query with the first and last name and manager id parameters
    connection.query(sql, [first_name, last_name, role_id, manager_id], (err, results) => {
      if (err) {
        console.error('Error adding employee:', err);
        reject(err);
      } else {
        console.log(`Employee '${first_name} ${last_name}' added successfully.`);
        resolve(results);
      }
    });
  });
}


function updateEmployeeRole(employeeId, newRoleId) {
  // Create an asynchronous promise using resolve and reject to handle the results
  return new Promise((resolve, reject) => {
    // Query to update the employee role based on employee ID
    const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
    // Execute query with new role id and employee id  parameters
    connection.query(sql, [newRoleId, employeeId], (err, results) => {
      if (err) {
        console.error('Error updating employee role:', err);
        reject(err);
      } else {
        console.log(`Employee with ID ${employeeId}'s role updated successfully.`);
        resolve(results);
      }
    });
  });
}

// Function to prompt for update employee role information
function promptForUpdateEmployeeRoleInfo() {
  return new Promise((resolve, reject) => {
    // Query to select if , first name and last name from employee table
    connection.query('SELECT id, first_name, last_name FROM employee', (err, employees) => {
      if (err) {
        reject(err);
      } else {
        // Use map to create a new array employee choices from employees array
        const employeeChoices = employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));

        // Query to select id and role from role table
        connection.query('SELECT id, title FROM role', (err, roles) => {
          if (err) {
            reject(err);
          } else {
            // Use map to create a new array role choices from roles array
            const roleChoices = roles.map((role) => ({
              name: role.title,
              value: role.id,
            }));
            // Prompt user to select from employee choices and role choices arrays
            inquirer
              .prompt([
                {
                  type: 'list',
                  name: 'employeeId',
                  message: 'Choose the employee whose role you want to update:',
                  choices: employeeChoices,
                },
                {
                  type: 'list',
                  name: 'newRoleId',
                  message: 'Choose the new role for the employee:',
                  choices: roleChoices,
                },
              ])
              .then((answers) => {
                // After the choice is made the answers are used with the update employee role function
                updateEmployeeRole(answers.employeeId, answers.newRoleId)
                  .then(() => {
                    resolve();
                  })
                  .catch((error) => {
                    reject(error);
                  });
              })
              .catch((error) => {
                reject(error);
              });
          }
        });
      }
    });
  });
}
