import { FormControl } from "@angular/forms";

export type LoginForm = {
    email: FormControl<string>;
    password: FormControl<string>;
}

export type ForgotPasswordForm = {
    email: FormControl<string>;
}