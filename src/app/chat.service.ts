import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Model } from './models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {}

  sendMessage(message: string, model: Model): Observable<any> {
    const requestBody = {
      message: message,
      model: model
    };

    return this.http.post('/api/replicate', requestBody).pipe(
      catchError((error) => {
        console.error("Error in Replicate API:", error);
        throw error;
      })
    );
  }
}