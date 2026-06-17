import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Assuming you have this to get user name

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  userName: string = 'User';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
  // Citim numele salvat în browser la login din token
  const storedName = localStorage.getItem('firstName');
  
  if (storedName) {
    this.userName = storedName;
  } else {
    this.userName = 'Pacient'; // Fallback în caz că nu e găsit
  }
}

  logout() {
    this.authService.logout(); // Make sure your auth service has a logout method
    this.router.navigate(['/login']);
  }
}