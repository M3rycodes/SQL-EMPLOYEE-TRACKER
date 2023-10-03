
const db = require('../config/db');

const createDepartment = (req, res) => {
  // Validate request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;

  // Insert the new department into the database
  const insertQuery = 'INSERT INTO department (name) VALUES (?)';
  db.query(insertQuery, [name], (insertError, insertResult) => {
    if (insertError) {
      return res.status(500).json({ error: 'Database error' });
    }

    return res.status(201).json({ message: 'Department created successfully' });
  });
}

// Export controller functions
module.exports = {
  createDepartment,
};


const listDepartments = (req, res) => {
  // Retrieve all departments from the database
  const query = 'SELECT * FROM department';

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }

    return res.status(200).json(results);
  });
};

// Export controller functions
module.exports = {
  listDepartments, 
};


  // Update the department in the database
  const updateQuery = 'UPDATE department SET name = ? WHERE id = ?';
  db.query(updateQuery, [name, departmentId], (updateError, updateResult) => {
    if (updateError) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    return res.status(200).json({ message: 'Department updated successfully' });
  });

// Export controller functions
module.exports = {
  updateDepartment, 
};



const updateDepartment = (req, res) => {
  const departmentId = req.params.id; // Assuming you pass the department ID in the URL
  const { name } = req.body;

  db.query('UPDATE department SET name = ? WHERE id = ?', [name, departmentId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    return res.status(200).json({ message: 'Department updated successfully' });
  });

  module.exports = {
    updateDepartment,
  }
};

// Delete department by ID
const deleteDepartment = (req, res) => {
  const departmentId = req.params.id; // Assuming you pass the department ID in the URL

  db.query('DELETE FROM department WHERE id = ?', [departmentId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    return res.status(200).json({ message: 'Department deleted successfully' });
  });

  module.exports = {
    deleteDepartment,
  }
};
