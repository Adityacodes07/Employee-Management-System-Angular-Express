// ============================================================
// server.js
// This is the ENTRY POINT of the Express backend.
// It sets up the server, middleware, and routes.
// Run this with: node server.js  OR  npm start
// ============================================================

const express = require('express');
const cors    = require('cors');    // Allows Angular (port 4200) to talk to Express (port 3000)
const path    = require('path');

const employeeRoutes = require('./routes/employee.routes'); // import our routes

const app  = express(); // create the Express application
const PORT = 3000;      // backend will run on http://localhost:3000

// ─────────────────────────────────────────────────────────────────
// MIDDLEWARE SETUP
// Middleware = functions that run on EVERY request before hitting routes
// Think of middleware as checkpoints on a highway
// ─────────────────────────────────────────────────────────────────

// 1. CORS Middleware
// By default browsers BLOCK requests from one port to another (security).
// cors() allows our Angular app (port 4200) to call this backend (port 3000).
app.use(cors({
  origin: 'http://localhost:4200', // only allow requests from Angular dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // allowed HTTP methods
}));

// 2. JSON Body Parser
// Tells Express to automatically parse incoming JSON request bodies.
// Without this, req.body would be undefined in our controller.
// Angular sends data as JSON, so this converts it to a JS object.
app.use(express.json());

// 3. URL-encoded Body Parser
// Parses form-encoded data (not needed for JSON API but good practice)
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────────────
// ROUTES
// Mount the employee router at /api/employees
// So every route in employee.routes.js is prefixed with /api/employees
//
// Example:
//   router.get('/')     → becomes →  GET  /api/employees
//   router.get('/:id')  → becomes →  GET  /api/employees/:id
//   router.post('/')    → becomes →  POST /api/employees
// ─────────────────────────────────────────────────────────────────
app.use('/api/employees', employeeRoutes);

// ─────────────────────────────────────────────────────────────────
// ROOT ROUTE — just a health check
// Visit http://localhost:3000 to confirm server is running
// ─────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🚀 Employee Management API is running!', status: 'OK' });
});

// ─────────────────────────────────────────────────────────────────
// GLOBAL ERROR HANDLER
// If any route throws an unhandled error, it lands here.
// Express recognizes a 4-argument function as an error handler.
// ─────────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ─────────────────────────────────────────────────────────────────
// START THE SERVER
// app.listen() starts listening for incoming HTTP requests on PORT
// ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
  console.log(`📂 API available at http://localhost:${PORT}/api/employees`);
});