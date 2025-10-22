import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChacraService, Chacra } from '../chacra.service';

@Component({
  selector: 'app-usercards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usercards.component.html',
  styleUrls: ['./usercards.component.css']
})
export class UsercardsComponent implements OnInit {
  chacras: Chacra[] = [];
  usuarioSeleccionado: Chacra | null = null;
  mostrarConfirmacion = false;
  cargando = true;
  errorMessage = '';

  constructor(
    private chacraService: ChacraService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarChacras();
  }

  // 🔹 Obtener chacras del usuario logueado
  cargarChacras(): void {
    this.cargando = true;
    this.chacraService.getMyChacras().subscribe({
      next: (data) => {
        this.chacras = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener chacras del usuario:', error);
        this.errorMessage = 'No se pudieron cargar las chacras.';
        this.cargando = false;
      }
    });
  }

  // 🟢 Pop-up principal
  abrirPop(chacra: Chacra) {
    this.usuarioSeleccionado = chacra;
  }

  cerrarPop(event: Event) {
    event.stopPropagation();
    this.usuarioSeleccionado = null;
    this.mostrarConfirmacion = false;
  }

  // 🟡 Acciones del pop-up
  irAActualizar(chacra: Chacra) {
    this.cerrarPop(new Event('close'));

    // ✅ Guardamos chacra en sessionStorage
    sessionStorage.setItem('chacraEdit', JSON.stringify(chacra));

    // ✅ Navegamos a la ruta correcta
    this.router.navigate(['/updateform']);
  }

  abrirConfirmacion() {
    this.mostrarConfirmacion = true;
  }

  cerrarConfirmacion(event: Event) {
    event.stopPropagation();
    this.mostrarConfirmacion = false;
  }

  // 🔴 Eliminar chacra (DELETE real al backend)
  confirmarBorrado() {
    if (!this.usuarioSeleccionado) return;

    const id = this.usuarioSeleccionado.id;

    this.chacraService.deleteChacra(id).subscribe({
      next: () => {
        console.log(`✅ Chacra ${id} eliminada correctamente`);
        this.chacras = this.chacras.filter(c => c.id !== id);
        this.usuarioSeleccionado = null;
        this.mostrarConfirmacion = false;
        alert('✅ Chacra eliminada correctamente.');
      },
      error: (err) => {
        console.error('❌ Error al eliminar chacra:', err);
        alert('⚠️ Error al eliminar la chacra. Inténtalo nuevamente.');
        this.mostrarConfirmacion = false;
      }
    });
  }

  // 🖼️ Arregla las rutas de las imágenes
  getImageUrl(imagenUrl: string | null | undefined): string {
    if (!imagenUrl) {
      return 'https://via.placeholder.com/400x200?text=Sin+Imagen';
    }

    // Si ya es una URL absoluta (por ejemplo, Pexels o CDN)
    if (imagenUrl.startsWith('http')) {
      return imagenUrl;
    }

    // Si es una ruta relativa del backend (/uploads/...)
    return `http://localhost:8080${imagenUrl}`;
  }
}
