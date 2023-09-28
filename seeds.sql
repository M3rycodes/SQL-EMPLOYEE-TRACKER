INSERT INTO department(id, name)
VALUES('HR'),
    ('Engineering'),
    ('Marketing');


INSERT INTO role (id, title, salary, department_id)
VALUES('HR Manager', 75000, 1),
    ('Software Engineer', 80000, 2),
    ('Marketing Specialist', 60000, 3);
    

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('Alice', 'Johnson', 3, 1),
    ('Bob', 'Brown', 1, NULL);

COMMIT;