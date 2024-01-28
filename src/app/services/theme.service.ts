import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkMode = signal<boolean>(false);

  switchTheme(): void {
    this.darkMode.update(d => !d);
  }

  isDarkMode(): boolean {
    return this.darkMode();
  }

}
