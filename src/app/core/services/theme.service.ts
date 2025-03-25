// src/app/core/services/theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'preferred-theme';
  private isDarkSubject = new BehaviorSubject<boolean>(false);
  public isDark$ = this.isDarkSubject.asObservable();

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    // Check for saved preference
    let savedTheme = localStorage.getItem(this.THEME_KEY);

    // If no saved preference, check system preference
    if (!savedTheme) {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      savedTheme = prefersDark ? 'dark' : 'light';
    }

    // Apply the theme
    this.setTheme(savedTheme === 'dark');
  }

  public toggleTheme(): void {
    this.setTheme(!this.isDarkSubject.value);
  }

  private setTheme(isDark: boolean): void {
    // Update state
    this.isDarkSubject.next(isDark);

    // Save preference
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');

    // Apply to document
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
}
