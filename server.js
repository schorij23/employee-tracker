const inquirer = require('inquirer')
const mysql = require('mysql2')

// Create the connection to database
const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'J9gRH4K$Wy4ju%qd10A6',
        database: 'employee_tracker'});


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
      // Function to start the Database
      function startDb() {
        // Prompt for User Choices for the Database
        return inquirer.prompt([
            {
              type: 'list',
              name: 'options',
              message: 'What would you like to do?',
              choices: ['View all departments','View all roles','View all employees','Add a department',
              'Add a role','Add an employee','Update an employee role',],
            },
          ])
          // After the user choice is made the function is called and options are handled
          .then((answers) => {
            const userChoice = answers.options;
            if (userChoice === 'View all departments') {
              return viewAllDepartments();
            } else if (userChoice === 'View all roles') {
              return viewAllRoles();
            } else if (userChoice === 'View all employees') {
              return viewAllEmployees();
            } else if (userChoice === 'Add a department') {
              return addDepartment();
            } else if (userChoice === 'Add a role') {
              return addRole();
            } else if (userChoice === 'Add an employee') {
              return addEmployee();
            } else if (userChoice === 'Update an employee role') {
              return updateEmployeeRole();
            } else {
              console.log('Invalid choice');
              return Promise.resolve();
            }
          })
          // After the Promise is resolved stop database connection
          .then(() => {
            connection.end();
          })
          // Catch the error and handle it for debugging
          .catch((error) => {
            console.error('There was an error:', error);
        });
      }
      // Function to view all department
      function viewAllDepartments() {
        // Add query logic and return a Promise
      }

      // Function to view all roles
      function viewAllRoles() {
        // Add query logic and return a Promise
      }

      // Function to view all employes
      function viewAllEmployees() {
        // Add query logic and return a Promise
      }

      // Function to add a department
      function addDepartment() {
        // Add query logic and return a Promise
      }

      // Function to add a role
      function addRole() {
        // Add query logic and return a Promise
      }

      // Function to add an employee
      function addEmployee() {
        // Add query logic and return a Promise
      }

      // Function to update a employees role
      function updateEmployeeRole() {
        // Add query logic and return a Promise
      }

