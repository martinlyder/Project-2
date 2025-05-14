// chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {}

  sendMessage(message: string, model: any): Observable<any> {
    return this.http.post('/api/replicate', { message, model });
  }

  checkPredictionStatus(predictionId: string): Observable<any> {
    return this.http.get(`/api/replicate/status/${predictionId}`);
  }
}
