import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface TriageSession {
  chiefComplaint: string;
  completedAt: string;
  finalDiagnosis: string;
  summary: string | null;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class HistoryComponent implements OnInit {

  reports: TriageSession[] = [];
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef // <--- 1. INJECT THIS
  ) {}

  ngOnInit() {
    this.fetchHistory();
  }

  fetchHistory() {
    console.log("🚀 Fetching history...");

    this.authService.getSessions().subscribe({
      next: (res: any) => {
        console.log("✅ History Data Received");

        const rawHistory: TriageSession[] = res.sessions || [];

        // Sort by date: Newest first
        this.reports = rawHistory.sort((a: TriageSession, b: TriageSession) => {
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        });

        this.isLoading = false;

        // <--- 2. FORCE SCREEN UPDATE
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("❌ Failed to load history", err);
        this.isLoading = false;

        // <--- 3. FORCE SCREEN UPDATE ON ERROR
        this.cdr.detectChanges();
      }
    });
  }
}