import { Component, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Message, Model, AVAILABLE_MODELS } from './app/models';
import { ChatService } from './app/chat.service';
import { provideHttpClient } from '@angular/common/http';

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

  sendMessage() {
    if (!this.currentMessage.trim()) return;

    const userMessage: Message = {
      content: this.currentMessage,
      isUser: true
    };
    
    this.messages.push(userMessage);
    
    this.chatService.sendMessage(this.currentMessage, this.selectedModel)
      .subscribe({
        next: (response) => {
          const botMessage: Message = {
            content: response.output,
            isUser: false
          };
          this.messages.push(botMessage);
        },
        error: (error) => {
          console.error('Error:', error);
          const errorMessage: Message = {
            content: 'Sorry, there was an error processing your message.',
            isUser: false
          };
          this.messages.push(errorMessage);
        }
      });

    this.currentMessage = '';
  }
}

bootstrapApplication(App, {
  providers: [
    ChatService,
    provideHttpClient()
  ]
});