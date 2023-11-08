const inquirer = require('inquirer')
const mysql = require('mysql2')
const figlet = require("figlet");

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

      figlet("Employee Tracker", { font: 'Standard', box: true }, function (err, data) {
        if (err) {
          console.log("Something went wrong...");
          console.dir(err);
          return;
        }
        console.log(data);
      });
      // Function to start the Database
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
                'Update an employee role','Quit the App',
              ],
            },
          ])
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
              } else if(userChoice.options === "Quit the App") {
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
  // Create a asynchronous promise using resolve and reject to handle the results
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM role', (err, results) => {
      if (err) {
        console.error('Error querying roles:', err);
        reject(err);
      } else {
        console.table(results);
        resolve(results);
      }
    });
  });
}

// Function to view all employees
function viewAllEmployees() {
  // Create a asynchronous promise using resolve and reject to handle the results
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM employee', (err, results) => {
      if (err) {
        console.error('Error querying employees:', err);
        reject(err);
      } else {
        console.table(results);
        resolve(results);
      }
    });
  });
}
      // REMEMBER TO CHANGE TO LIST WITH MULTIPLE CHOICES
      // Function to prompt to add a department
      function promptForDepartmentInfo() {
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

      
      function addDepartment(name) {
        // Create a asynchronous promise using resolve and reject to handle the results
          return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO department (name) VALUES (?)';
            connection.query(sql, [name], (err, results) => {
              if (err) {
                console.error('Error adding department:', err);
                reject(err);
              } else {
                console.log(`Department '${name}' added successfully.`);
                resolve(results);
              }
            });
          });
        }
        var allDepartmentNames = [];
      function getAllDepartments() {
        connection.query('SELECT name FROM department', (err, results) => {
          // If there is an error reject the query
          if (err) {
            console.error('Error querying departments:', err);
            reject(err);
            // Otherwise Return the Results
          } else {

            for (let index = 0; index < results.length; index++) {
              const element = results[index];
              allDepartmentNames.push(element.name);
            }
          }
            
        });
      }  
      // Function to prompt for role information
    async function promptForRoleInfo() {
      getAllDepartments();
      return new Promise((resolve, reject) => {
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
            // loop through results variable on 174 find department id that matches the choosen department??
            
            // change answer for department id from name departmentName to id departmentID

            // allDepartmentNames need to work with addRole function
            
            // change the string input to int to Set the correct department ID as an integer
            //answers.departmentId = choosen department id

            
            resolve(answers);

          })
          .catch((error) => {
            reject(error);
          });
      });
    }


      // Function to add a role
      function addRole(title, salary, department_id) {
        // Create a asynchronous promise using resolve and reject to handle the results
        return new Promise((resolve, reject) => {
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

            
      // Function to prompt for employee information
      function promptForEmployeeInfo() {
        return new Promise((resolve, reject) => {
          inquirer
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
                type: 'input',
                name: 'role_id',
                message: 'Enter the role ID for this employee:',
              },
              {
                type: 'input',
                name: 'manager_id',
                message: 'Enter the manager\'s ID for this employee (or leave empty if none):',
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
      // Function to add an employee
      function addEmployee(first_name, last_name, role_id, manager_id) {
        // Create a asynchronous promise using resolve and reject to handle the results
        return new Promise((resolve, reject) => {
          // Convert manager_id to an integer or set it to null if it's empty
            manager_id = manager_id === '' ? null : parseInt(manager_id);
          const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
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
// Function to update an employee's role
function updateEmployeeRole(employeeId, newRoleId) {
  // Create an asynchronous promise using resolve and reject to handle the results
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
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
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'employeeId',
          message: 'Enter the employee\'s ID whose role you want to update:',
        },
        {
          type: 'input',
          name: 'newRoleId',
          message: 'Enter the new role ID for the employee:',
        },
      ])
      .then((answers) => {
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
  });
}




