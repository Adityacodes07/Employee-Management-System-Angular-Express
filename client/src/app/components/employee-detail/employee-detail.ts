// ============================================================
// employee-detail.component.ts
// Shows full profile of a single employee.
// Uses ChangeDetectorRef for zoneless change detection.
// ============================================================

import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailComponent implements OnInit {

  employee: Employee | null = null;
  loading = true;
  error = '';

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/employees']);
      return;
    }

    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employee = data;
        this.loading = false;
        this.cdr.markForCheck(); // trigger re-render with data
      },
      error: () => {
        this.error = 'Employee not found or server error.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  editEmployee(): void {
    if (this.employee) {
      this.router.navigate(['/employees', this.employee.id, 'edit']);
    }
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

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
}
