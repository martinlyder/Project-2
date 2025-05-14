import { Component, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Message, Model, AVAILABLE_MODELS } from './app/models';
import { ChatService } from './app/chat.service';
import { AuthService } from './app/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { interval, switchMap, takeWhile } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="!(authService.isAuthenticated$ | async)" class="login-container">
      <div class="login-box">
        <h2>Login</h2>
        <div class="login-form">
          <input 
            type="text" 
            [(ngModel)]="username" 
            placeholder="Username"
            class="login-input"
          >
          <input 
            type="password" 
            [(ngModel)]="password" 
            placeholder="Password"
            class="login-input"
          >
          <button 
            (click)="login()" 
            class="login-button"
            [disabled]="isLoggingIn"
          >
            {{ isLoggingIn ? 'Logging in...' : 'Login' }}
          </button>
          <div *ngIf="loginError" class="login-error">
            Invalid credentials
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="authService.isAuthenticated$ | async" class="chat-container">
      <div class="sidebar">
        <select [(ngModel)]="selectedModel">
          <option *ngFor="let model of models" [ngValue]="model">
            {{ model.name }}
          </option>
        </select>
        <button (click)="logout()" class="logout-button">Logout</button>
      </div>
      
      <div class="main-content">
        <div class="chat-messages">
          <div *ngFor="let message of messages" 
            class="message" 
            [class.user-message]="message.isUser"
            [class.bot-message]="!message.isUser"
            [innerHTML]="message.content">
          </div>
        </div>
        
        <div class="input-container">
          <input type="text" 
                 class="message-input" 
                 [(ngModel)]="currentMessage" 
                 (keyup.enter)="sendMessage()"
                 placeholder="Type your message...">
          <button class="send-button" (click)="sendMessage()">Send</button>
        </div>
      </div>
    </div>
  `,
})
export class App {
  private chatService = inject(ChatService);
  authService = inject(AuthService);
  
  models = AVAILABLE_MODELS;
  selectedModel = this.models[0];
  messages: Message[] = [];
  currentMessage = '';
  isLoading = false;

  // Login related properties
  username = '';
  password = '';
  isLoggingIn = false;
  loginError = false;

  login() {
    this.isLoggingIn = true;
    this.loginError = false;
    
    this.authService.login(this.username, this.password).subscribe({
      next: (success) => {
        if (!success) {
          this.loginError = true;
        }
        this.isLoggingIn = false;
      },
      error: () => {
        this.loginError = true;
        this.isLoggingIn = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.messages = [];
  }

  sendMessage() {
    if (!this.currentMessage.trim()) return;

    const userMessage: Message = {
      content: this.currentMessage,
      isUser: true
    };
    
    this.messages.push(userMessage);
    this.isLoading = true;

    this.chatService.sendMessage(this.currentMessage, this.selectedModel)
      .subscribe({
        next: (response) => {
          this.pollPrediction(response.predictionId);
        },
        error: (error) => {
          console.error('Error:', error);
          this.displayError();
        }
      });

    this.currentMessage = '';
  }

  convertNewlinesToBr(text: string): string {
    return text.replace(/\n\n/g, '<br>').replace(/\n/g, '<br>');
  }

  pollPrediction(predictionId: string) {
    interval(2000)
      .pipe(
        switchMap(() => this.chatService.checkPredictionStatus(predictionId)),
        takeWhile(response => response.status !== 'succeeded' && response.status !== 'failed', true)
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'succeeded') {
            const botMessage: Message = {
              content: this.convertNewlinesToBr(response.output.join("") || "Sorry, no response received."),
              isUser: false
            };

            this.messages.push(botMessage);
          } else if (response.status === 'failed') {
            this.displayError();
          }
          this.isLoading = false;
        },
        error: () => {
          this.displayError();
          this.isLoading = false;
        }
      });
  }

  displayError() {
    const errorMessage: Message = {
      content: 'Sorry, there was an error processing your message.',
      isUser: false
    };
    this.messages.push(errorMessage);
    this.isLoading = false;
  }
}

bootstrapApplication(App, {
  providers: [
    ChatService,
    AuthService,
    provideHttpClient()
  ]
});