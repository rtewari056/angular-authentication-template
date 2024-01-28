import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, finalize, switchMap } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Component
import { NavbarComponent, ViewSubmissionDialogComponent } from '../../components';

// Service
import { ApiService, DialogService, FormService } from '../../services';

// Type
import { Submission } from '../../shared/models/types/dashboard.type';
import { ViewSubmissionDialogData } from '../../shared/models/types/dialog.type';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule, MatTooltipModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit {

  // =============== Injecting Dependencies ===============
  private readonly apiService = inject(ApiService);
  readonly formService = inject(FormService);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);

  // Make sure it only sets the sort and paginator if undefined
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) this.dataSource.sort = sort;

  }
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    if (!this.dataSource.paginator) this.dataSource.paginator = paginator;
  }

  isLoading = signal<boolean>(false);

  dataSource = new MatTableDataSource<Submission>([]);

  displayedColumns: string[] = ['employeeId', 'employeeName', 'date', 'awardCategory', 'action'];

  ngOnInit(): void {
    this.loadSubmissions();
  }

  ngAfterViewInit(): void {
    // Set sorting and pagination after the view is instantiated
    this.dataSource.sort = this.matSort;
    this.dataSource.paginator = this.matPaginator;

    // Initialize table search when user starts typing on the search box
    this.initializeTableSearch();
  }

  // Returns field values from form
  private getFieldValue(fieldName: string): string {
    return this.formService.dashboardSearchForm.get(fieldName)?.value;
  }

  showClearButton(): string {
    return this.getFieldValue('searchTerm')
  }

  clearSearch(): void {
    this.formService.dashboardSearchForm.reset();
  }

  initializeTableSearch(): void {
    this.formService.dashboardSearchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms pause in events
        distinctUntilChanged(), // only emit if the value has changed
        switchMap((query) => {
          this.isLoading.set(true);
          return this.apiService.searchSubmissions(query)
        }), // switch to new observable for each query
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          if (response && response.body) {
            this.dataSource = new MatTableDataSource(response.body.slice(5));
            this.isLoading.set(false);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          console.log(error);
        }
      })
  }

  loadSubmissions(): void {
    this.isLoading.set(true);

    this.apiService.searchSubmissions('')
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          if (response && response.body) {
            this.dataSource = new MatTableDataSource(response.body);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      });
  }

  viewSubmission(row: Submission): void {
    const dialogData: ViewSubmissionDialogData = { employeeId: row.employeeId, categoryName: row.awardCategory, nominationReason: row.nominationReason };

    // Open dialog
    const dialogRef: MatDialogRef<ViewSubmissionDialogComponent, string> = this.dialogService.openViewSubmissionDialog(dialogData);

    // Handle user actions after dialog closes
    dialogRef
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(status => {
        switch (status) {
          case 'approved':
            console.log('Approved');
            break;

          case 'rejected':
            console.log('Rejected');
            break;
        
          default:
            console.log('Closed');
            break;
        }
      })
  }

}
