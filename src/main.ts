// main.ts
import { Component, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Message, Model, AVAILABLE_MODELS } from './app/models';
import { ChatService } from './app/chat.service';
import { provideHttpClient } from '@angular/common/http';
import { interval, switchMap, takeWhile } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <div class="sidebar">
        <select [(ngModel)]="selectedModel">
          <option *ngFor="let model of models" [ngValue]="model">
            {{ model.name }}
          </option>
        </select>
      </div>
      
      <div class="main-content">
        <div class="chat-messages">
          <div *ngFor="let message of messages" 
               class="message" 
               [class.user-message]="message.isUser"
               [class.bot-message]="!message.isUser">
            {{ message.content }}
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
  
  models = AVAILABLE_MODELS;
  selectedModel = this.models[0];
  messages: Message[] = [];
  currentMessage = '';
  isLoading = false;

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
              content: response.output.join(" ") || "Sorry, no response received.",
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
    provideHttpClient()
  ]
});
