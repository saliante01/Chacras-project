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
  private apiUrl = 'http://localhost:8080/api/chacras';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener todas las chacras públicas
  getPublicChacras(): Observable<Chacra[]> {
    return this.http.get<Chacra[]>(`${this.apiUrl}/public`, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  // 🔹 Obtener chacras del usuario autenticado
  getMyChacras(): Observable<Chacra[]> {
    return this.http.get<Chacra[]>(`${this.apiUrl}/mine`, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  // 🔹 Crear chacra como usuario (usa endpoint /full)
  createChacra(nombre: string, ubicacion: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('ubicacion', ubicacion);
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/full`, formData, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  // 🔹 Crear chacra como ADMIN (puede asignar usuario)
  createChacraForUser(nombre: string, ubicacion: string, emailUsuario: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('ubicacion', ubicacion);
    formData.append('emailUsuario', emailUsuario);
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/admin/full`, formData, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  // 🔹 Manejo de errores centralizado
  private handleError(error: HttpErrorResponse) {
    console.error('Error en solicitud de chacra:', error);
    let message = 'Error desconocido';
    if (error.status === 0) message = 'No hay conexión con el servidor.';
    else if (error.status === 403) message = 'No autorizado.';
    else if (error.status === 404) message = 'Chacra no encontrada.';
    else if (error.error?.message) message = error.error.message;

    return throwError(() => new Error(message));
  }
}
