// ============================================================
// employee.controller.js
// This file contains the LOGIC for each CRUD operation.
// Each function here is called by a specific route in employee.routes.js
// Think of controller = the brain, route = the door
// ============================================================

const fs   = require('fs');   // Node's built-in file system module
const path = require('path'); // Node's built-in path helper
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// Path to our JSON "database" file
// __dirname = the folder where THIS file lives (controllers/)
// We go one level up (..) then into data/employees.json
const DB_PATH = path.join(__dirname, '..', 'data', 'employees.json');

// ─────────────────────────────────────────────
// HELPER: Read all employees from the JSON file
// ─────────────────────────────────────────────
// We call this every time we need the current list.
// fs.readFileSync reads the file and returns raw text.
// JSON.parse converts that text into a JavaScript array.
function readEmployees() {
  const fileData = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(fileData); // returns an array of employee objects
}

// ─────────────────────────────────────────────
// HELPER: Write employees array back to JSON file
// ─────────────────────────────────────────────
// We call this every time we make a change (add/update/delete).
// JSON.stringify converts the JS array back to formatted text.
// null, 2 → makes the JSON nicely indented by 2 spaces
function writeEmployees(employees) {
  fs.writeFileSync(DB_PATH, JSON.stringify(employees, null, 2), 'utf-8');
}

// ─────────────────────────────────────────────────────────────────
// READ ALL  →  GET /api/employees
// Returns the full list of employees
// ─────────────────────────────────────────────────────────────────
const getAllEmployees = (req, res) => {
  try {
    const employees = readEmployees(); // read from JSON file
    res.status(200).json(employees);   // send array as JSON response
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// READ ONE  →  GET /api/employees/:id
// Returns a single employee by their ID
// :id in the route becomes req.params.id here
// ─────────────────────────────────────────────────────────────────
const getEmployeeById = (req, res) => {
  try {
    const employees = readEmployees();

    // .find() loops through the array and returns the FIRST match
    const employee = employees.find(emp => emp.id === req.params.id);

    if (!employee) {
      // 404 = Not Found — the ID doesn't match anyone
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee); // send the matching employee
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employee', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// CREATE  →  POST /api/employees
// Angular sends new employee data in req.body
// We generate a unique ID, add it to the list, then save
// ─────────────────────────────────────────────────────────────────
const createEmployee = (req, res) => {
  try {
    const employees = readEmployees();

    // Build the new employee object
    // Spread operator (...req.body) copies all fields Angular sent
    // We override the id with a freshly generated UUID
    const newEmployee = {
      id: uuidv4(),       // auto-generate a unique ID (e.g. "f3a9b1c2-...")
      ...req.body,        // name, email, phone, department, role, salary, etc.
    };

    employees.push(newEmployee);    // add to the array
    writeEmployees(employees);      // save updated array to JSON file

    // 201 = Created — standard success code for POST
    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create employee', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// UPDATE  →  PUT /api/employees/:id
// Angular sends the updated fields in req.body
// We find the employee, merge old + new data, then save
// ─────────────────────────────────────────────────────────────────
const updateEmployee = (req, res) => {
  try {
    const employees = readEmployees();

    // findIndex() returns the position (0,1,2...) of the employee in the array
    // Returns -1 if not found
    const index = employees.findIndex(emp => emp.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Merge the old employee data with the new data from Angular
    // The spread order matters:
    //   employees[index] = existing data (kept as base)
    //   req.body        = new data (overwrites matching fields)
    //   id              = always keep the original ID, never change it
    const updatedEmployee = {
      ...employees[index],  // existing fields (keeps any field Angular didn't send)
      ...req.body,          // new fields from Angular (overwrites existing)
      id: req.params.id,    // force keep original ID safe
    };

    employees[index] = updatedEmployee; // replace old record in array
    writeEmployees(employees);          // save to JSON file

    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update employee', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// DELETE  →  DELETE /api/employees/:id
// Removes the employee with the matching ID from the JSON file
// ─────────────────────────────────────────────────────────────────
const deleteEmployee = (req, res) => {
  try {
    const employees = readEmployees();

    // .filter() creates a NEW array keeping only employees whose ID does NOT match
    // This effectively removes the employee with the matching ID
    const filtered = employees.filter(emp => emp.id !== req.params.id);

    if (filtered.length === employees.length) {
      // If lengths are equal, nothing was removed → ID didn't exist
      return res.status(404).json({ message: 'Employee not found' });
    }

    writeEmployees(filtered); // save the reduced array

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
// Export all controller functions so routes can import and use them
// ─────────────────────────────────────────────────────────────────
module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};