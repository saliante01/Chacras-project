import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/login';
  private userUrl = 'http://localhost:8080/api/user/current';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    const formData = new FormData();
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);

    return this.http.post(this.apiUrl, formData, {
      withCredentials: true, // ✅ permite enviar/recibir cookies
      responseType: 'text'   // el backend no devuelve JSON en /login
    }).pipe(
      map(() => ({ success: true })), // login exitoso
      catchError((error: HttpErrorResponse) => {
        console.error('Error en el login:', error);
        return throwError(() => error);
      })
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(this.userUrl, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener usuario actual:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post('http://localhost:8080/api/logout', {}, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al cerrar sesión:', error);
        return throwError(() => error);
      })
    );
  }
}
