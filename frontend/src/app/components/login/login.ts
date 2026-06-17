import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // 1. Import Router
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  errorMessage: string = '';
  isLoading: boolean = false;

  // 2. Inject Router in the constructor
  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        // --- CRITICAL STEP START ---

        console.log('Backend Response:', response);

        const token = response.token || response.accessToken || response.jwt;

        if (token) {
          // 1. Salvăm token-ul normal
          localStorage.setItem('token', token);

          try {
            // 2. TRUCUL: Decodăm partea de mijloc a token-ului JWT (payload-ul) direct în browser
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            console.log('Decoded Payload:', tokenPayload);

            // 3. Extragem firstName din payload și îl salvăm în localStorage
            if (tokenPayload && tokenPayload.firstName) {
              localStorage.setItem('firstName', tokenPayload.firstName);
            }
          } catch (e) {
            console.error('Nu s-a putut decoda token-ul pentru nume:', e);
          }

          // 4. Navigăm la dashboard
          console.log('Navigating to dashboard...');
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Login successful, but no token received.';
        }

        // --- CRITICAL STEP END ---
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
        if (error?.error && typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else if (error?.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error?.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }
}