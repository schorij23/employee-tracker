const inquirer = require('inquirer')
const mysql = require('mysql2')

// create the connection to database
const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'employee_tracker'});


// connect to the database
connection.connect(function(err) {
        if (err) {
            console.error('error connecting');
            return;
        }
        console.log('connected');
        startDb();
});

// Function to start database?
