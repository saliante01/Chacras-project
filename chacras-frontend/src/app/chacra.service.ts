import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Chacra {
  id: number;
  nombre: string;
  ubicacion: string;
  imagenUrl: string;
  usuarioEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChacraService {
  private apiUrl = 'http://localhost:8080/api/chacras/public'; // 👈 endpoint GET del backend

  constructor(private http: HttpClient) {}

  getChacras(): Observable<Chacra[]> {
    return this.http.get<Chacra[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener chacras:', error);
        return throwError(() => error);
      })
    );
  }
}
