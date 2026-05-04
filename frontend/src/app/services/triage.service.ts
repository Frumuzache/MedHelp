import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface TriageResponse {
  reply: string;
  isFinal: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TriageService {
  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) { }

  /**
   * Send a message to the triage AI
   * @param message User's message/symptoms
   * @param conversationId Previous conversation ID (not used in current backend)
   * @param userId Current user's ID (not used in current backend)
   * @returns Observable with AI response containing reply and isFinal flag
   */
  sendMessage(message: string, conversationId: string | null, userId: string | null): Observable<TriageResponse> {
    // Get email from localStorage (set during login)
    const token = localStorage.getItem('token');
    let email = '';
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        email = payload.email;
      } catch (e) {
        console.error('Could not decode token', e);
      }
    }

    const payload = {
      email,
      message
    };
    
    return this.http.post<TriageResponse>(`${this.apiUrl}/ai/chat`, payload);
  }

  /**
   * Reset the conversation state (start a new chat)
   * @param userId Current user's ID (not used in current backend)
   * @returns Observable with confirmation
   */
  resetConversation(userId: string | null): Observable<any> {
    const token = localStorage.getItem('token');
    let email = '';
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        email = payload.email;
      } catch (e) {
        console.error('Could not decode token', e);
      }
    }

    return this.http.post(`${this.apiUrl}/ai/reset`, { email });
  }
}
