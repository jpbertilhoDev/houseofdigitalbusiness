// src/app/core/components/theme-toggle/theme-toggle.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="theme-toggle-btn"
      [class.dark]="isDark"
      (click)="toggleTheme()"
      aria-label="Toggle theme"
    >
      <div class="icon-container">
        <i class="fas fa-sun light-icon"></i>
        <i class="fas fa-moon dark-icon"></i>
      </div>
    </button>
  `,
  styles: [
    `
      .theme-toggle-btn {
        position: relative;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: none;
        background-color: transparent;
        cursor: pointer;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      .theme-toggle-btn:hover {
        background-color: rgba(0, 255, 255, 0.1);
        transform: scale(1.1);
      }

      .icon-container {
        position: relative;
        width: 24px;
        height: 24px;
      }

      .light-icon,
      .dark-icon {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275),
          opacity 0.5s ease;
      }

      .light-icon {
        color: #05bebe;
        opacity: 1;
        transform: translateY(0) rotate(0);
      }

      .dark-icon {
        color: #05bebe;
        opacity: 0;
        transform: translateY(20px) rotate(90deg);
      }

      .theme-toggle-btn.dark .light-icon {
        opacity: 0;
        transform: translateY(-20px) rotate(-90deg);
      }

      .theme-toggle-btn.dark .dark-icon {
        opacity: 1;
        transform: translateY(0) rotate(0);
      }

      @media (max-width: 768px) {
        .theme-toggle-btn {
          width: 40px;
          height: 40px;
        }
      }
    `,
  ],
})
export class ThemeToggleComponent implements OnInit {
  isDark = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.isDark$.subscribe((isDark) => {
      this.isDark = isDark;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
