const inquirer = require('inquirer');
const mysql = require('mysql2');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: "",
  database: 'employee_db',
  
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
  startApp();
});

function startApp() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Update employee manager',
          'View employees by manager',
          'View employees by department',
          'Delete department',
          'Delete role',
          'Delete employee',
          'View department budget',
          'Exit',
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    });
}

function viewDepartments() {
  // Implement code to view all departments
  const query = 'SELECT id, name FROM department';

  connection.query(query, (err, res) => {
    if (err) throw err;

    console.log('\nList of Departments:');
    console.table(res);

    // After displaying the departments, return to the main menu
    startApp();
  });

}

function viewRoles() {
  // Implement code to view all roles
  const query = 'SELECT id, title, salary, department_id FROM role';

  connection.query(query, (err, res) => {
    if (err) throw err;

    console.log('\nList of Roles:');
    console.table(res);

    // After displaying the roles, return to the main menu
    startApp();
  });
}

function viewEmployees() {
  // Implement code to view all employees
  const query = `
    SELECT 
      e.id,
      e.first_name,
      e.last_name,
      r.title AS job_title,
      d.name AS department,
      r.salary,
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
  `;

  connection.query(query, (err, res) => {
    if (err) throw err;

    console.log('\nList of Employees:');
    console.table(res);

    // After displaying the employees, return to the main menu
    startApp();
  });
}

function addDepartment() {
  // Implement code to add a department
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:',
        validate: (input) => {
          if (input.trim() === '') {
            return 'Department name cannot be empty';
          }
          return true;
        },
      },
    ])
    .then((answer) => {
      const query = 'INSERT INTO department (name) VALUES (?)';

      connection.query(query, [answer.departmentName], (err, res) => {
        if (err) throw err;

        console.log(`\nDepartment "${answer.departmentName}" added successfully!`);

        // After adding the department, return to the main menu
        startApp();
      });
    });
}

function addRole() {
  // Implement code to add a role
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role:',
    },
    {
      type: 'number',
      name: 'salary',
      message: 'Enter the salary for the role:',
    },
    {
      type: 'number',
      name: 'departmentId',
      message: 'Enter the department ID for the role:',
    },
  ])
  .then((answer) => {
    const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';

    connection.query(query, [answer.title, answer.salary, answer.departmentId], (err, res) => {
      if (err) throw err;

      console.log(`\nRole "${answer.title}" added successfully!`);

      // After adding the role, return to the main menu
      startApp();
    });
  }); 
}

function addEmployee() {
  // Implement code to add an employee
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter the first name of the employee:',
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter the last name of the employee:',
      },
      {
        type: 'number',
        name: 'roleId',
        message: 'Enter the role ID for the employee:',
      },
      {
        type: 'number',
        name: 'managerId',
        message: 'Enter the manager ID for the employee (or leave empty if none):',
      },
    ])
    .then((answer) => {
      const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';

      connection.query(
        query,
        [answer.firstName, answer.lastName, answer.roleId, answer.managerId || null],
        (err, res) => {
          if (err) throw err;

          console.log(`\nEmployee "${answer.firstName} ${answer.lastName}" added successfully!`);

          // After adding the employee, return to the main menu
          startApp();
        }
      );
    });
}

function updateEmployeeRole() {
  inquirer
  .prompt([
    {
      type: 'number',
      name: 'employeeId',
      message: 'Enter the ID of the employee you want to update:',
    },
    {
      type: 'number',
      name: 'newRoleId',
      message: 'Enter the new role ID for the employee:',
    },
  ])
  .then((answer) => {
  const employeeId = answer.employeeId;
  const newRoleId = answer.newRoleId;

  const query = 'UPDATE employee SET role_id = ? WHERE id = ?';

  connection.query(query, [newRoleId, employeeId], (err, res) => {
    if (err) throw err;

    console.log(`\nEmployee's role updated successfully!`);

    // After updating the role, return to the main menu
    startApp();
    });
});
}

function updateEmployeeManager() {
  inquirer
    .prompt([
      {
        type: 'number',
        name: 'employeeId',
        message: 'Enter the ID of the employee you want to update:',
      },
      {
        type: 'number',
        name: 'newManagerId',
        message: 'Enter the new manager ID for the employee:',
      },
    ])
    .then((answer) => {
      const employeeId = answer.employeeId;
      const newManagerId = answer.newManagerId;

      const query = 'UPDATE employee SET manager_id = ? WHERE id = ?';

      connection.query(query, [newManagerId, employeeId], (err, res) => {
        if (err) throw err;

        console.log(`\nEmployee's manager updated successfully!`);

        // After updating the manager, return to the main menu
        startApp();
      });
    });
}

function viewEmployeesByManager() {
  inquirer
    .prompt([
      {
        type: 'number',
        name: 'managerId',
        message: 'Enter the ID of the manager to view employees:',
      },
    ])
    .then((answer) => {
      const managerId = answer.managerId;

      const query = 'SELECT * FROM employee WHERE manager_id = ?';

      connection.query(query, [managerId], (err, res) => {
        if (err) throw err;

        console.log(`\nEmployees managed by Manager ID ${managerId}:`);
        console.table(res);

        // After displaying the employees, return to the main menu
        startApp();
      });
    });
}

function viewEmployeesByDepartment() {
  inquirer
    .prompt([
      {
        type: 'number',
        name: 'departmentId',
        message: 'Enter the ID of the department to view employees:',
      },
    ])
    .then((answer) => {
      const departmentId = answer.departmentId;

      const query = 'SELECT * FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ?)';

      connection.query(query, [departmentId], (err, res) => {
        if (err) throw err;

        console.log(`\nEmployees in Department ID ${departmentId}:`);
        console.table(res);

        // After displaying the employees, return to the main menu
        startApp();
      });
    });
}

function deleteDepartment() {
  inquirer
    .prompt([
      {
        type: 'number',
        name: 'departmentId',
        message: 'Enter the ID of the department to delete:',
      },
    ])
    .then((answer) => {
      const departmentId = answer.departmentId;

      const query = 'DELETE FROM department WHERE id = ?';

      connection.query(query, [departmentId], (err, res) => {
        if (err) throw err;

        console.log(`\nDepartment with ID ${departmentId} deleted successfully!`);

        // After deleting the department, return to the main menu
        startApp();
      });
    });
}

function viewDepartmentBudget() {
  inquirer
    .prompt([
      {
        type: 'number',
        name: 'departmentId',
        message: 'Enter the ID of the department to view budget:',
      },
    ])
    .then((answer) => {
      const departmentId = answer.departmentId;

      const query = 'SELECT SUM(r.salary) AS total_budget FROM employee e JOIN role r ON e.role_id = r.id WHERE r.department_id = ?';

      connection.query(query, [departmentId], (err, res) => {
        if (err) throw err;

        const totalBudget = res[0].total_budget || 0;

        console.log(`\nTotal Utilized Budget for Department ID ${departmentId}: $${totalBudget}`);

        // After displaying the budget, return to the main menu
        startApp();
      });
    });
}

const express = require('express');
const app = express();

// Import necessary modules and database connections here

// Define a route for deleting a department
app.delete('/department/:departmentId', async (req, res) => {
  try {
    const departmentId = req.params.departmentId;

    // Implement logic to delete the department from the database
    // Example for MongoDB/Mongoose:
    // await Department.findByIdAndDelete(departmentId);

    // Example for MySQL/Sequelize:
    // await Department.destroy({ where: { id: departmentId } });

    // Send a success response
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting department' });
  }
});

// ... other routes and middleware

// Start your Express.js server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const departmentIdToDelete = '123'; // Replace with the actual department ID
fetch(`/departments/${departmentIdToDelete}`, {
  method: 'DELETE',
})
  .then((response) => {
    if (response.ok) {
      console.log('Department deleted successfully');
      // Handle success
    } else {
      console.error('Error deleting department');
      // Handle error
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    // Handle error
  });
