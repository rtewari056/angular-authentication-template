import { Injectable } from '@angular/core';
// import { UserInfo } from '../../shared/models/types/auth.type';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  setRole(role: string): void {
    sessionStorage.setItem('role', role);
  }

  getRole(): string | null {
    const role: string | null = sessionStorage.getItem('role');
    return (role) ? role : null;
  }

  setUserInfo(userInfo: any): void {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  getUserInfo(): any | null {
    const userInfo: string | null = sessionStorage.getItem('userInfo');

    // Return null if userInfo not exists else return it
    return userInfo === null ? null : JSON.parse(userInfo);
  }

  setToken(jwtToken: string | null): void {
    sessionStorage.setItem('jwtToken', (jwtToken) ? jwtToken : '');
  }

  getToken(): string | null {
    const jwtToken: string | null = sessionStorage.getItem('jwtToken')
    return (jwtToken) ? jwtToken : null;
  }

  isLoggedIn(): boolean {
    // If role and token both is not null return true
    return this.getRole() !== null && this.getToken() !== null;
  }

  // Get email of the logged in user
  getEmail(): string {
    const userInfo: any | null = this.getUserInfo();

    // Return empty string if userInfo not exists else return the email
    return userInfo === null ? '' : userInfo.email;
  }

  logout(): void {
    sessionStorage.clear()
  }
}

