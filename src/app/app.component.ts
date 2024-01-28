import { Component, HostBinding, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeService } from './services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-authentication-template';

  protected readonly themeService = inject(ThemeService);

  @HostBinding('class.dark') get mode() {
    return this.themeService.isDarkMode();
  }
}
