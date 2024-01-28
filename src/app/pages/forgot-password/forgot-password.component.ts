import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// Service
import { ApiService, FormService } from '../../services';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, RouterLink, NgIf],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {

  // =============== Injecting Dependencies ===============
  private readonly apiService = inject(ApiService);
  readonly formService = inject(FormService);
  private readonly destroyRef = inject(DestroyRef);

  isLoading = signal<boolean>(false);

  emailErrorMessages = [
    { error: 'required', message: `Email can't be empty` },
    { error: 'email', message: 'Invalid email format' }
  ];

  // Creating a function to get errors dynamically depending on 'formControlName' and 'errorType'
  hasValidationError(formControlName: string, errorType: string): boolean | undefined {
    return this.formService.forgotPasswordForm.get(formControlName)?.hasError(errorType);
  }

  // Returns field values from login form
  private getFieldValue(fieldName: string): string {
    return this.formService.forgotPasswordForm.get(fieldName)?.value;
  }

  onSubmit(): void {
    // If form is invalid, do nothing
    if (this.formService.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    const forgotPasswordEmail: string = this.getFieldValue('email');

    this.apiService.forgotPassword(forgotPasswordEmail)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          if (response && response.body) {
            this.formService.forgotPasswordForm.reset();
            this.formService.forgotPasswordForm.controls.email.setErrors(null);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      });
  }

}
