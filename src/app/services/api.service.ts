import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

// Types
// import { ForgotPassword, Login, UserInfo } from '../../shared/models/types/auth.type';
// import { Category } from '../../shared/models/types/category.typs';
// import { Submission } from '../../shared/models/types/dashboard.type';
// import { Nomination } from '../../shared/models/types/nomination.type';

// Environment variables
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // =============== Injecting Dependencies ===============
  private readonly httpClient = inject(HttpClient);

  // Options for HTTP request
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as const // The observe option can take one of three values: 'body', 'response', or 'events'. So taking 'response' as const
  };

  // <----- User Auth ----->

  // Login user
  login(loginData: any) {
    return this.httpClient.post<any>(`${environment.API_URL}/login.php`, loginData, this.httpOptions);
  }

  // Forgot password
  forgotPassword(email: string) {
    return this.httpClient.get<any>(`${environment.API_URL}/user/forgotpassword/${email}`, this.httpOptions);
  }

}
