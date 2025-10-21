import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8080/api/register';

  constructor(private http: HttpClient) {}

  registerUser(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post<{ message: string }>(this.apiUrl, data).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error en la solicitud de registro:', error);
        return throwError(() => error);
      })
    );
  }
}
