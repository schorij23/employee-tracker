-- seeds used to prepopulate your database fields so there is somthing in the db?

-- examples

INSERT INTO department (name) VALUES
('HR'),
('IT'),
('ACCOUNTING'),
('LEGAL');
INSERT INTO role (title, salary, department_id) VALUES 
('Manager', 60000, 1),
('Lawyer', 50000, 4),
('Sales Lead', 50000, 3),
('Salesperson', 30000, 3),
('Lead Engineer', 70000, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Smith', 1, NULL), 
('Dave', 'Johnson', 3, NULL),
('Micheal', 'Jordan', 2, 1),
('Steve', 'Smith', 5, NULL),
('Micheal', 'Jones', 3, 3),
('Micheal', 'Smith', 3, 3);
