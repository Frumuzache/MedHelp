import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PartnerService, SessionSummary } from '../../services/partner.service';

@Component({
  selector: 'app-partner-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partner-dashboard.html',
  styleUrls: ['./partner-dashboard.css'],
})
export class PartnerDashboardComponent implements OnInit {
  sessions: SessionSummary[] = [];
  selectedSession: SessionSummary | null = null;
  summary: string | null = null;
  parsedSummary: Record<string, string> = {};
  isLoadingSessions = false;
  isLoadingSummary = false;
  errorMessage = '';

  constructor(private partnerService: PartnerService, private router: Router) {}

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    this.isLoadingSessions = true;
    this.partnerService.getSessions().subscribe({
      next: (res) => {
        this.sessions = res.sessions;
        this.isLoadingSessions = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load sessions. Please log in again.';
        this.isLoadingSessions = false;
      },
    });
  }

  selectSession(session: SessionSummary) {
    this.selectedSession = session;
    this.summary = session.summary;
    this.parsedSummary = session.summary ? this.parseSummary(session.summary) : {};
  }

  generateSummary() {
    if (!this.selectedSession) return;
    this.isLoadingSummary = true;
    this.partnerService.summarizeSession(this.selectedSession._id).subscribe({
      next: (res) => {
        this.summary = res.summary;
        this.parsedSummary = this.parseSummary(res.summary);
        this.selectedSession!.summary = res.summary;
        this.isLoadingSummary = false;
      },
      error: () => {
        this.errorMessage = 'Failed to generate summary.';
        this.isLoadingSummary = false;
      },
    });
  }

  parseSummary(raw: string): Record<string, string> {
    const result: Record<string, string> = {};
    const lines = raw.split('\n');
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        if (key) result[key] = value;
      }
    }
    return result;
  }

  getUrgencyClass(urgency: string): string {
    switch (urgency?.toUpperCase()) {
      case 'EMERGENCY': return 'urgency-emergency';
      case 'HIGH': return 'urgency-high';
      case 'MEDIUM': return 'urgency-medium';
      default: return 'urgency-low';
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/partner-login']);
  }
}