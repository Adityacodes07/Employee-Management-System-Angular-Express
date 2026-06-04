// ============================================================
// employee-list.component.ts
// Shows ALL employees in a table.
// Uses ChangeDetectorRef because we are in ZONELESS mode —
// Angular no longer auto-detects async changes, so we call
// cdr.markForCheck() after any data change to tell Angular
// "hey, re-render this component".
// ============================================================

import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
templateUrl: './employee-list.html',
  // OnPush = only re-render when inputs change OR markForCheck() is called
  // Required for zoneless mode to work correctly
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];
  loading = false;
  error = '';
  deleteConfirmId: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private cdr: ChangeDetectorRef  // inject ChangeDetectorRef for zoneless
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = '';

    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
        this.cdr.markForCheck(); // tell Angular to re-render
      },
      error: (err) => {
        this.error = 'Failed to load employees. Is the backend running?';
        this.loading = false;
        this.cdr.markForCheck(); // re-render even on error
        console.error('Error loading employees:', err);
      },
    });
  }

  editEmployee(id: string): void {
    this.router.navigate(['employees', id, 'edit']);
  }

  confirmDelete(id: string): void {
    this.deleteConfirmId = id;
    this.cdr.markForCheck();
  }

  cancelDelete(): void {
    this.deleteConfirmId = null;
    this.cdr.markForCheck();
  }

  deleteEmployee(id: string): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.employees = this.employees.filter(emp => emp.id !== id);
        this.deleteConfirmId = null;
        this.cdr.markForCheck(); // re-render after deletion
      },
      error: (err) => {
        this.error = 'Failed to delete employee.';
        this.cdr.markForCheck();
        console.error('Error deleting employee:', err);
      },
    });
  }

  getStatusClass(status: string): string {
    return status === 'active'
      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
      : 'bg-slate-100 text-slate-500 border border-slate-200';
  }

  getDeptClass(dept: string): string {
    const map: Record<string, string> = {
      Engineering: 'bg-blue-100 text-blue-700',
      HR:          'bg-purple-100 text-purple-700',
      Sales:       'bg-orange-100 text-orange-700',
      Finance:     'bg-green-100 text-green-700',
      Marketing:   'bg-pink-100 text-pink-700',
    };
    return map[dept] || 'bg-gray-100 text-gray-700';
  }
}
