import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Model } from './models';
import Replicate from "replicate";
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiKey = environment.replicateApiToken; // Using the environment variable
  private replicate = new Replicate({
    auth: this.apiKey
  });

  constructor() {}

  sendMessage(message: string, model: Model): Observable<any> {
    return from(this.callReplicateApi(message, model)).pipe(
      catchError((error) => {
        console.error("Error in Replicate API:", error);
        throw error;
      })
    );
  }

  private async callReplicateApi(message: string, model: Model): Promise<any> {
    if (!this.apiKey) {
      throw new Error("Replicate API token is missing. Please set it in environment variables.");
    }

    const input = { 
      prompt: message,
      ...model.parameters
    };
    const output = await this.replicate.run(model.version, { input });
    return output;
  }
}
