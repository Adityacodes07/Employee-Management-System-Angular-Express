// ============================================================
// employee.service.ts
// This service is the BRIDGE between Angular components and the Express API.
// All HTTP calls (GET, POST, PUT, DELETE) live here.
//
// WHY a service?
//   Components should only handle UI logic.
//   Data fetching belongs in a service so it can be reused
//   across multiple components without duplicating code.
//
// Observable<T>:
//   HttpClient returns RxJS Observables — think of them as
//   "promises that can emit multiple values over time."
//   Components subscribe() to them to get the data.
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from '../models/employee.model';

// @Injectable({ providedIn: 'root' })
// Makes this service available EVERYWHERE in the app
// without needing to add it to any providers array manually.
@Injectable({ providedIn: 'root' })
export class EmployeeService {

  // Base URL of our Express backend API
  // All HTTP calls will be prefixed with this URL
  private readonly apiUrl = '/api/employees'; // Proxy forwards this to http://localhost:3000/api/employees

  // Angular automatically injects HttpClient here via the constructor.
  // We mark it as private because only THIS service should use it directly.
  constructor(private http: HttpClient) {}

  // ─────────────────────────────────────────────────────────────────
  // READ ALL  →  GET /api/employees
  // Returns an Observable that emits an array of all employees.
  // Components call this to populate the employee table.
  // ─────────────────────────────────────────────────────────────────
  getAllEmployees(): Observable<Employee[]> {
    // http.get<Employee[]>() tells TypeScript the response is an array of Employee
    return this.http.get<Employee[]>(this.apiUrl);
  }

  // ─────────────────────────────────────────────────────────────────
  // READ ONE  →  GET /api/employees/:id
  // Fetches a single employee by their ID.
  // The backtick string (template literal) builds the URL dynamically:
  //   e.g. `${this.apiUrl}/${id}` → "http://localhost:3000/api/employees/abc-123"
  // ─────────────────────────────────────────────────────────────────
  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  // ─────────────────────────────────────────────────────────────────
  // CREATE  →  POST /api/employees
  // Sends a new employee object to the backend.
  // The backend adds the ID and saves it.
  // Returns the created employee (with ID) from the backend response.
  // ─────────────────────────────────────────────────────────────────
  createEmployee(employee: CreateEmployeeDto): Observable<{ message: string; employee: Employee }> {
    // http.post() sends a POST request with the employee object as the JSON body
    return this.http.post<{ message: string; employee: Employee }>(this.apiUrl, employee);
  }

  // ─────────────────────────────────────────────────────────────────
  // UPDATE  →  PUT /api/employees/:id
  // Sends the updated employee fields to the backend.
  // The backend merges it with the existing record.
  // ─────────────────────────────────────────────────────────────────
  updateEmployee(id: string, employee: UpdateEmployeeDto): Observable<{ message: string; employee: Employee }> {
    // http.put() sends a PUT request with the updated data as the JSON body
    return this.http.put<{ message: string; employee: Employee }>(
      `${this.apiUrl}/${id}`,
      employee
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // DELETE  →  DELETE /api/employees/:id
  // Tells the backend to remove the employee with this ID.
  // Returns a success message.
  // ─────────────────────────────────────────────────────────────────
  deleteEmployee(id: string): Observable<{ message: string }> {
    // http.delete() sends a DELETE request to the URL with the ID
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
