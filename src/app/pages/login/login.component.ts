import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { finalize } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// Service
import { ApiService, FormService, SessionStorageService } from '../../services';
import { Login } from '../../models/types/auth.type';

// Type

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  // =============== Injecting Dependencies ===============
  private readonly apiService = inject(ApiService);
  readonly formService = inject(FormService);
  private readonly sessionStorageService = inject(SessionStorageService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  isLoading = signal<boolean>(false);

  emailErrorMessages = [
    { error: 'required', message: `Email can't be empty` },
    { error: 'email', message: 'Invalid email format' }
  ];

  passwordErrorMessages = [
    { error: 'required', message: `Password can't be empty` },
  ];

  // Creating a function to get errors dynamically depending on 'formControlName' and 'errorType'
  hasValidationError(formControlName: string, errorType: string): boolean | undefined {
    return this.formService.loginForm.get(formControlName)?.hasError(errorType);
  }

  // Returns field values from login form
  private getFieldValue(fieldName: string): string {
    return this.formService.loginForm.get(fieldName)?.value;
  }

  onSubmit(): void {
    // If form is invalid, do nothing
    if(this.formService.loginForm.invalid) {
      return;
    }
    
    this.isLoading.set(true);

    const loginData: Login = {
      email: this.getFieldValue('email'),
      password: this.getFieldValue('password'),
    }

    this.apiService.login(loginData)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          if (response && response.headers && response.body) {

            // Setting info
            this.sessionStorageService.setUserInfo(response.body);
            this.sessionStorageService.setRole(response.body.role); // Set role type of user from API
            this.sessionStorageService.setToken(response.headers.get('Token'));

            // Get role from the local storage
            const role: string | null = this.sessionStorageService.getRole();

            switch (role) {
              case 'ROLE_USER':
                this.router.navigate(['/category']);
                break;
              case 'ROLE_APPROVER':
                this.router.navigate(['/dashboard']);
                break;
              default:
                this.router.navigate(['/category']);
            }

            // this.formService.loginForm.reset();
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      });
  }
}
