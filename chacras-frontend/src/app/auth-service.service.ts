import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // 🔐 Iniciar sesión (usa cookies)
  login(email: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    return this.http.post(`${this.baseUrl}/login`, formData, {
      withCredentials: true,      // ✅ Mantiene la cookie JSESSIONID
      responseType: 'json'
    }).pipe(catchError(this.handleError));
  }

  // 🔓 Cerrar sesión
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  // 👤 Obtener usuario actual
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/current`, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  // ⚠️ Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('Error en AuthService:', error);
    let msg = 'Error inesperado. Inténtalo más tarde.';
    if (error.error?.message) msg = error.error.message;
    return throwError(() => new Error(msg));
  }



}
