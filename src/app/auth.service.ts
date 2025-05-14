import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{success: boolean}>('/api/auth', { username, password })
      .pipe(
        map(response => {
          this.isAuthenticatedSubject.next(response.success);
          return response.success;
        })
      );
  }

  logout() {
    this.isAuthenticatedSubject.next(false);
  }
}