// ============================================================
// employee.routes.js
// This file defines the API ENDPOINTS (URLs) for employees.
// Each route maps a HTTP method + URL → to a controller function.
//
// Think of routes as a MENU in a restaurant:
//   Route  = item on the menu ("GET /employees")
//   Controller = the chef who actually cooks it
// ============================================================

const express    = require('express');
const router     = express.Router(); // Router lets us define grouped routes

// Import all controller functions from the controller file
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employee.controller');

// ─────────────────────────────────────────────────────────────────
// GET /api/employees
// Fetches ALL employees from the JSON file
// Angular calls this on the Employee List page to display the table
// ─────────────────────────────────────────────────────────────────
router.get('/', getAllEmployees);

// ─────────────────────────────────────────────────────────────────
// GET /api/employees/:id
// Fetches ONE employee by ID
// :id is a dynamic segment — e.g. /api/employees/e1a2b3c4-0001
// Angular calls this on the Employee Detail page
// ─────────────────────────────────────────────────────────────────
router.get('/:id', getEmployeeById);

// ─────────────────────────────────────────────────────────────────
// POST /api/employees
// Creates a NEW employee
// Angular sends form data in the request body
// Controller reads req.body, adds UUID, saves to JSON
// ─────────────────────────────────────────────────────────────────
router.post('/', createEmployee);

// ─────────────────────────────────────────────────────────────────
// PUT /api/employees/:id
// Updates an EXISTING employee by ID
// Angular sends updated form data in the request body
// Controller merges old + new data and saves to JSON
// ─────────────────────────────────────────────────────────────────
router.put('/:id', updateEmployee);

// ─────────────────────────────────────────────────────────────────
// DELETE /api/employees/:id
// Deletes an employee by ID
// Angular calls this when user clicks the "Delete" button
// Controller filters out the employee and saves updated list
// ─────────────────────────────────────────────────────────────────
router.delete('/:id', deleteEmployee);

// Export the router so server.js can use it
module.exports = router;