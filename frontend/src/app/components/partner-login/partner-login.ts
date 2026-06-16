import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PartnerService } from '../../services/partner.service';

@Component({
  selector: 'app-partner-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './partner-login.html',
  styleUrls: ['./partner-login.css'],
})
export class PartnerLoginComponent {
  credentials = { email: '', password: '' };
  errorMessage = '';
  isLoading = false;

  constructor(private partnerService: PartnerService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.partnerService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        localStorage.setItem('token', response.token);
        this.router.navigate(['/partner-dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.error || 'Login failed. Please try again.';
      },
    });
  }
}
