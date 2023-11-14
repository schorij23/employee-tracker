-- seeds used to prepopulate your database fields so there is somthing in the db?

INSERT INTO department (name) VALUES
('HR'),
('IT'),
('ACCOUNTING'),
('LEGAL'),
('SALES'),
('ORGANIZATIONAL');
INSERT INTO role (title, salary, department_id) VALUES 
('Manager', 80000, 1),
('Lawyer', 70000, 4),
('Sales Lead', 50000, 5),
('Salesperson', 30000, 5),
('Lead Engineer', 70000, 2),
('Administrative Assistant', 40000, 6),
('Accountant', 60000, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Smith', 1, NULL), 
('Dave', 'Johnson', 3, NULL),
('Micheal', 'Jordan', 2, 1),
('Steve', 'Smith', 5, NULL),
('Micheal', 'Jones', 3, 3),
('Micheal', 'Smith', 3, 3),
('Mike', 'Jones', 7, NULL),
('Shara', 'Clark', 6, NULL);
