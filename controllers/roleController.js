const createRole = (req, res) => {
    // Validate request data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { title, salary, departmentId } = req.body;
  
    // Check if the provided department ID exists in the database
    db.query('SELECT * FROM department WHERE id = ?', [departmentId], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(400).json({ error: 'Department not found' });
      }
  
      // Insert the new role into the database
      const insertQuery = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
      db.query(insertQuery, [title, salary, departmentId], (insertError, insertResult) => {
        if (insertError) {
          return res.status(500).json({ error: 'Database error' });
        }
  
        return res.status(201).json({ message: 'Role created successfully' });
      });
    });
  };
  
  // Export controller functions
  module.exports = {
    createRole,
    // Other controller functions
  };

  const listRoles = (req, res) => {
    // Retrieve all roles from the database
    const query = 'SELECT * FROM role';
  
    db.query(query, (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Database error' });
      }
  
      return res.status(200).json(results);
    });
  };
  
  // Export controller functions
  module.exports = {
    createRole,
    listRoles, // Add this function
    // Other controller functions
  };
 
  const updateRole = (req, res) => {
    const roleId = req.params.id;
    const { title, salary, departmentId } = req.body;
  
    // Update the role in the database
    const updateQuery = 'UPDATE role SET title = ?, salary = ?, department_id = ? WHERE id = ?';
    db.query(updateQuery, [title, salary, departmentId, roleId], (updateError, updateResult) => {
      if (updateError) {
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ error: 'Role not found' });
      }
  
      return res.status(200).json({ message: 'Role updated successfully' });
    });
  };
  
  // Export controller functions
  module.exports = {
    createRole,
    listRoles,
    updateRole, // Add this function
    // Other controller functions
  };

  
  const deleteRole = (req, res) => {
    const roleId = req.params.id;
  
    // Delete the role from the database
    const deleteQuery = 'DELETE FROM role WHERE id = ?';
    db.query(deleteQuery, [roleId], (deleteError, deleteResult) => {
      if (deleteError) {
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ error: 'Role not found' });
      }
  
      return res.status(200).json({ message: 'Role deleted successfully' });
    });
  };
  
  // Export controller functions
  module.exports = {
    createRole,
    listRoles,
    updateRole,
    deleteRole, // Add this function
    // Other controller functions
  };

  
  