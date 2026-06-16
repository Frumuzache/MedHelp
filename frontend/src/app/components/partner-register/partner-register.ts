import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PartnerService } from '../../services/partner.service';

@Component({
  selector: 'app-partner-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './partner-register.html',
  styleUrls: ['./partner-register.css'],
})
export class PartnerRegisterComponent {
  partner = { firstName: '', lastName: '', email: '', password: '' };
  errorMessage = '';
  successToken = '';
  isLoading = false;

  constructor(private partnerService: PartnerService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.partnerService.register(this.partner).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successToken = response.partnerToken;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error?.error?.message || error?.error?.error || 'Registration failed. Please try again.';
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/partner-login']);
  }
}
