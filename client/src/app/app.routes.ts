// ============================================================
// app.routes.ts
// Defines all URL routes for the Angular app.
// Angular Router reads this to know which component to show
// when the user navigates to a specific URL.
// ============================================================

import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirect the root URL '' to /employees
  // pathMatch: 'full' means only redirect when the URL is EXACTLY ''
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full',
  },

  // ── /employees ─────────────────────────────────────────────
  // Shows the list of ALL employees in a table
  // loadComponent = lazy loading (loads the file only when needed)
  // This keeps the initial bundle small and fast
  {
    path: 'employees',
    loadComponent: () =>
      import('./components/employee-list/employee-list').then(
        m => m.EmployeeListComponent
      ),
  },

  // ── /employees/new ────────────────────────────────────────
  // Shows the form for CREATING a new employee
  // NOTE: 'new' must come BEFORE ':id' so Angular doesn't
  //       confuse the word "new" as an employee ID
  {
    path: 'employees/new',
    loadComponent: () =>
      import('./components/employee-form/employee-form').then(
        m => m.EmployeeFormComponent
      ),
  },

  // ── /employees/:id ────────────────────────────────────────
  // Shows the DETAIL VIEW of a single employee
  // :id is a dynamic segment that captures the actual ID from the URL
  // e.g. /employees/e1a2b3c4-0001
  {
    path: 'employees/:id',
    loadComponent: () =>
      import('./components/employee-detail/employee-detail').then(
        m => m.EmployeeDetailComponent
      ),
  },

  // ── /employees/:id/edit ───────────────────────────────────
  // Shows the EDIT FORM for an existing employee (same form component as /new)
  // The form component checks the URL to decide if it's creating or editing
  {
    path: 'employees/:id/edit',
    loadComponent: () =>
      import('./components/employee-form/employee-form').then(
        m => m.EmployeeFormComponent
      ),
  },

  // ── Wildcard / 404 ─────────────────────────────────────────
  // If none of the above routes match, redirect to employees list
  {
    path: '**',
    redirectTo: 'employees',
  },
];
