import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TriageService } from '../../services/triage.service';
import { AuthService } from '../../services/auth.service'; // Import AuthService

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string; 
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  newMessage: string = '';
  currentConversationId: string | null = null;
  
  // To store the User ID
  currentUserId: string | null = null;
  
  isTyping: boolean = false;
  isDropdownOpen: boolean = false;
  isDiagnosisComplete: boolean = false;

  constructor(
    private triageService: TriageService,
    private authService: AuthService, // Inject Auth Service
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // 1. Get User ID from AuthService (decoding token)
    // Note: We need to make sure authService has a method to get the ID.
    // If not, we can grab it from the token stored in localStorage.
    
    // Quick method using localStorage if your login saves the token:
    const token = localStorage.getItem('token');
    if (token) {
       // Decode payload to get _id
       try {
         const payload = JSON.parse(atob(token.split('.')[1]));
         this.currentUserId = payload._id;
         console.log("Chat Active for User ID:", this.currentUserId);
       } catch (e) {
         console.error("Could not decode token", e);
       }
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  toggleDropdown() { this.isDropdownOpen = !this.isDropdownOpen; }
  
  goToProfile() { this.router.navigate(['/profile']); }
  
  logout() { 
    localStorage.clear(); 
    this.router.navigate(['/login']); 
  }

  formatMessage(text: string): string {
    // ... (Keep your formatting logic for bolding and links) ...
    let safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    safeText = safeText.replace(/\n/g, '<br>');
    safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    safeText = safeText.replace(urlRegex, '<a href="$1" target="_blank" style="color: #4f46e5; text-decoration: underline;">$1</a>');
    return safeText;
  }

  sendMessage() {
    // Added check for 'isTyping' so you can't send twice at once
    if (!this.newMessage.trim() || this.isDiagnosisComplete || this.isTyping) return;

    const textToSend = this.newMessage;
    this.newMessage = ''; 

    this.messages.push({
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    });

    this.isTyping = true;

    this.triageService.sendMessage(textToSend, this.currentConversationId, this.currentUserId).subscribe({
      next: (response: any) => {
        this.isTyping = false; // Stop loading animation
        
        if (!this.currentConversationId && response.conversation_id) {
          this.currentConversationId = response.conversation_id;
        }

        this.handleAiResponse(response);
        
        // --- FIX: FORCE SCREEN UPDATE ---
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        this.isTyping = false;
        console.error(err);
        this.messages.push({
          sender: 'bot',
          text: "Connection error. Please try again.",
          timestamp: new Date().toISOString()
        });
        
        // --- FIX: FORCE SCREEN UPDATE ON ERROR TOO ---
        this.cdr.detectChanges();
      }
    });
  }

  
  private handleAiResponse(response: any) {
    // Backend returns { reply: string, isFinal: boolean }
    if (response.error) {
      console.error('Error from backend:', response.error);
      return;
    }

    const reply = response.reply || 'No response from AI';
    const isFinal = response.isFinal || false;
    
    // Add bot's response to chat
    this.messages.push({
      sender: 'bot',
      text: reply,
      timestamp: new Date().toISOString()
    });

    // If diagnosis is complete, disable further input
    if (isFinal) {
      this.isDiagnosisComplete = true;
    }
  }
}