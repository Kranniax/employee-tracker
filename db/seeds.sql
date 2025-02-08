INSERT INTO department (name) 
VALUES
('Engineering'),
('Sales'),
('Finance'),
('Legal'),
('Human Resources'),
('Marketing');

-- Role seed data
INSERT INTO role (title, salary, department_id) 
VALUES
('Software Engineer', 95000.00, 1),
('Senior Software Engineer', 125000.00, 1),
('Engineering Manager', 150000.00, 1),
('Sales Representative', 65000.00, 2),
('Sales Manager', 95000.00, 2),
('Financial Analyst', 85000.00, 3),
('Finance Manager', 115000.00, 3),
('Legal Counsel', 125000.00, 4),
('HR Coordinator', 60000.00, 5),
('HR Manager', 90000.00, 5),
('Marketing Specialist', 70000.00, 6),
('Marketing Director', 110000.00, 6);



-- Employee seed data (managers and employees mixed together)
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES
('Michael', 'Williams', 7, NULL),    -- Finance Manager
('Emily', 'Anderson', 2, 1),         -- Senior Software Engineer under John
('John', 'Smith', 3, NULL),          -- Engineering Manager
('Lisa', 'Martinez', 4, 2),          -- Sales Rep under Sarah
('Sarah', 'Johnson', 5, NULL),       -- Sales Manager
('Jennifer', 'Garcia', 6, 3),        -- Financial Analyst under Michael
('David', 'Davis', 12, NULL),        -- Marketing Director
('Robert', 'Wilson', 1, 1),          -- Software Engineer under John
('Jessica', 'Brown', 10, NULL),      -- HR Manager
('William', 'Moore', 6, 3),          -- Financial Analyst under Michael
('James', 'Taylor', 1, 1),           -- Software Engineer under John
('Michelle', 'Lewis', 11, 5),        -- Marketing Specialist under David
('Daniel', 'Thomas', 4, 2),          -- Sales Rep under Sarah
('Christopher', 'Rodriguez', 9, 4),   -- HR Coordinator under Jessica
('Ashley', 'Lee', 8, 3),             -- Legal Counsel under Michael
('Kevin', 'Walker', 11, 5);          -- Marketing Specialist under David