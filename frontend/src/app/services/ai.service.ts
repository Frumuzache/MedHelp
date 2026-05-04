import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  chat(email: string, message: string): Observable<{ reply: string; isFinal: boolean }> {
    return this.http.post<{ reply: string; isFinal: boolean }>(`${this.apiUrl}/ai/chat`, {
      email,
      message,
    });
  }

  reset(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/ai/reset`, { email });
  }
}