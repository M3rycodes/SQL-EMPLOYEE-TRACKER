const db = require('../config/db');

// Function to create a new department
const createEmployee = (req, res) => {
  
    // Validate and insert department into the database
const errors = validationResult(req);
if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
}

const { firstName, lastName, roleId, managerId } = req.body;

// Check if the provided role ID exists in the database
db.query('SELECT * FROM role WHERE id = ?', [roleId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Role not found' });
    }
    
// Check if the provided manager ID exists in the database
    if (managerId !== null) {
      db.query('SELECT * FROM employee WHERE id = ?', [managerId], (managerError, managerResults) => {
        if (managerError) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (managerResults.length === 0) {
          return res.status(400).json({ error: 'Manager not found' });
        }

// Insert the new employee into the database
const insertQuery = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
db.query(insertQuery, [firstName, lastName, roleId, managerId], (insertError, insertResult) => {
  if (insertError) {
    return res.status(500).json({ error: 'Database error' });
  }

  return res.status(201).json({ message: 'Employee created successfully' });
});
});
} else {

// If managerId is null, insert the new employee without a manager
const insertQuery = 'INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)';
db.query(insertQuery, [firstName, lastName, roleId], (insertError, insertResult) => {
if (insertError) {
  return res.status(500).json({ error: 'Database error' });
}

return res.status(201).json({ message: 'Employee created successfully' });
});
}
});
};


module.exports = {
createEmployee,
};













// Export controller functions
module.exports = {
  createDepartment,
  // Other controller functions
};
