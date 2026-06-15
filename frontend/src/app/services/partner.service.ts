import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SessionSummary {
  _id: string;
  patientEmail: string;
  chiefComplaint: string;
  completedAt: string;
  finalDiagnosis: string;
  summary: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  register(data: { email: string; firstName: string; lastName: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/partners/register`, data);
  }

  login(credentials: { email: string; password: string }): Observable<{ token: string; message: string }> {
    return this.http.post<{ token: string; message: string }>(
      `${this.apiUrl}/partners/login`,
      credentials
    );
  }

  getSessions(): Observable<{ sessions: SessionSummary[] }> {
    return this.http.get<{ sessions: SessionSummary[] }>(
      `${this.apiUrl}/partners/sessions`,
      { headers: this.getHeaders() }
    );
  }

  summarizeSession(id: string): Observable<{ summary: string; cached: boolean }> {
    return this.http.post<{ summary: string; cached: boolean }>(
      `${this.apiUrl}/partners/sessions/${id}/summarize`,
      {},
      { headers: this.getHeaders() }
    );
  }
}