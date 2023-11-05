-- Drops the sample_db if it exists currently --
DROP DATABASE IF EXISTS employee_tracker;
-- Creates the sample_db database --
CREATE DATABASE employee_tracker;
-- Uses the database
USE employee_tracker;

CREATE TABLE department (
    id INT AUTO_INCREMENT
 NOT NULL PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);



