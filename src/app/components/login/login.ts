import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Card } from '../card/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, Card],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  protected username = '';
  protected password = '';
  protected errorMessage = signal<string | null>(null);

  constructor(private readonly authService: AuthService) {}

  protected onLogin(): void {
    this.errorMessage.set(null);

    if (!this.username || !this.password) {
      this.errorMessage.set('Please enter both username and password');
      return;
    }

    const success = this.authService.login(this.username, this.password);
    
    if (!success) {
      this.errorMessage.set('Invalid credentials. Password must be at least 4 characters.');
      this.password = ''; // Clear password on failed attempt
    }
  }

  protected onLogout(): void {
    this.authService.logout();
    this.username = '';
    this.password = '';
    this.errorMessage.set(null);
  }

  protected get isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
