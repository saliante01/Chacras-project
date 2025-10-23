import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // Campos del formulario
  nombre = '';
  ubicacion = '';
  dueno = '';

  // Emisor de búsqueda
  @Output() search = new EventEmitter<{ nombre: string; ubicacion: string; dueno: string }>();

  constructor(private router: Router) {}

  // Enviar búsqueda
  onSearch() {
    this.search.emit({
      nombre: this.nombre,
      ubicacion: this.ubicacion,
      dueno: this.dueno
    });
  }

  // Limpiar campos
  limpiarCampo(campo: 'nombre' | 'ubicacion' | 'dueno') {
    if (campo === 'nombre') this.nombre = '';
    if (campo === 'ubicacion') this.ubicacion = '';
    if (campo === 'dueno') this.dueno = '';
  }

  // Navegar a login
  onLogin() {
    this.router.navigate(['/login']);
  }
}
