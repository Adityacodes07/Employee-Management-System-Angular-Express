// ============================================================
// employee-form.component.ts
// Handles both CREATE and EDIT in one component.
// Uses ChangeDetectorRef for zoneless change detection.
// ============================================================

import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EmployeeService } from '../../services/employee.service';
import { Employee, DEPARTMENTS, ROLES } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent implements OnInit {

  isEditMode = false;
  editId = '';
  loadingEmployee = false;
  submitting = false;
  error = '';

  departments = DEPARTMENTS;
  roles = ROLES;

  formData: Omit<Employee, 'id'> = {
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    role: 'Developer',
    salary: 0,
    joiningDate: '',
    status: 'active',
  };

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef  // for zoneless re-rendering
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.editId = id;
      this.loadEmployeeForEdit(id);
    }
  }

  loadEmployeeForEdit(id: string): void {
    this.loadingEmployee = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        const { id: _, ...rest } = employee;
        this.formData = rest;
        this.loadingEmployee = false;
        this.cdr.markForCheck(); // re-render with loaded data
      },
      error: () => {
        this.error = 'Failed to load employee data.';
        this.loadingEmployee = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSubmit(): void {
    this.submitting = true;
    this.error = '';
    this.cdr.markForCheck();

    const request$ = this.isEditMode
      ? this.employeeService.updateEmployee(this.editId, this.formData)
      : this.employeeService.createEmployee(this.formData);

    request$.subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.error = this.isEditMode ? 'Failed to update employee.' : 'Failed to create employee.';
        this.submitting = false;
        this.cdr.markForCheck();
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
