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
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChacraService {
  private apiUrl = 'http://localhost:8080/api/chacras';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener todas las chacras públicas (solo activas)
  getPublicChacras(): Observable<Chacra[]> {
    return this.http.get<Chacra[]>(`${this.apiUrl}/public`, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  getPublicChacraById(id: number): Observable<Chacra> {
    return this.http.get<Chacra>(`${this.apiUrl}/public/${id}`, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  // 🔹 Obtener chacras del usuario autenticado (solo activas)
  getMyChacras(): Observable<Chacra[]> {
    return this.http.get<Chacra[]>(`${this.apiUrl}/mine`, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  // 🔹 Crear chacra como usuario (usa endpoint /full)
  // ⚠️ AHORA INCLUYE DESCRIPCIÓN
  createChacra(nombre: string, ubicacion: string, descripcion: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('ubicacion', ubicacion);
    formData.append('descripcion', descripcion);  // ✔ AGREGADO
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
    formData.append('userEmail', emailUsuario);
    if (file) {
      formData.append('file', file);
    }

    return this.http.post(`${this.apiUrl}/admin/create`, formData, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  // 🔹 Eliminar chacra por ID (borrado lógico en backend)
  deleteChacra(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
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
    else if (error.status === 500) message = 'Error interno del servidor.';
    else if (error.error?.message) message = error.error.message;

    return throwError(() => new Error(message));
  }
}
