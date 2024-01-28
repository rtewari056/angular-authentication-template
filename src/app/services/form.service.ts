import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Type
import { LoginForm } from '../models/types/form.type';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  // =============== Injecting Dependencies ===============
  readonly fb = inject(FormBuilder);

  loginForm: FormGroup<LoginForm> = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

}
