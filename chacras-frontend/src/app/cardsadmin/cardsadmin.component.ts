import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChacraService, Chacra } from '../chacra.service';

@Component({
  selector: 'app-cardsadmin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cardsadmin.component.html',
  styleUrls: ['./cardsadmin.component.css']
})
export class CardsadminComponent implements OnInit {
  chacras: Chacra[] = [];
  chacraSeleccionada: Chacra | null = null;
  mostrarConfirmacion = false;
  cargando = true;
  errorMessage = '';

  constructor(
    private chacraService: ChacraService,
    private router: Router
  ) {
    // 🔁 Cada vez que se navega a esta ruta, recargo las chacras
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.cargarChacras();
      });
  }

  ngOnInit(): void {
    this.cargarChacras();
  }

  // 🔹 Obtener todas las chacras (endpoint público)
  cargarChacras(): void {
    this.cargando = true;
    this.errorMessage = '';

    this.chacraService.getPublicChacras().subscribe({
      next: (data) => {
        this.chacras = data.map(chacra => ({
          ...chacra,
          imagenUrl: chacra.imagenUrl
            ? `http://localhost:8080${chacra.imagenUrl}`
            : 'https://via.placeholder.com/400x200?text=Sin+Imagen'
        }));
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error al obtener chacras:', err);
        this.errorMessage = err.message || 'Error al cargar las chacras.';
        this.cargando = false;
      }
    });
  }

  // 🟢 Abrir popup con info de la chacra
  abrirPop(chacra: Chacra): void {
    this.chacraSeleccionada = chacra;
    this.mostrarConfirmacion = false;
  }

  cerrarPop(event: Event): void {
    event.stopPropagation();
    this.chacraSeleccionada = null;
    this.mostrarConfirmacion = false;
  }

  // 🟡 Ir a actualizar
  irAActualizar(chacra: Chacra): void {
    this.cerrarPop(new Event('close'));
    sessionStorage.setItem('chacraEdit', JSON.stringify(chacra));
    this.router.navigate(['/updateformadmin']);
  }

  // 🔴 Borrar chacra: abrir confirmación
  abrirConfirmacion(): void {
    this.mostrarConfirmacion = true;
  }

  cerrarConfirmacion(event: Event): void {
    event.stopPropagation();
    this.mostrarConfirmacion = false;
  }

  confirmarBorrado(): void {
    if (!this.chacraSeleccionada) return;

    const id = this.chacraSeleccionada.id;

    this.chacraService.deleteChacra(id).subscribe({
      next: () => {
        console.log(`✅ Chacra ${id} eliminada correctamente`);
        // La saco de la lista local
        this.chacras = this.chacras.filter(c => c.id !== id);
        this.chacraSeleccionada = null;
        this.mostrarConfirmacion = false;
        alert('✅ Chacra eliminada correctamente.');
      },
      error: (err) => {
        console.error('❌ Error al eliminar chacra:', err);
        alert(err.message || '⚠️ Error al eliminar la chacra. Inténtalo nuevamente.');
        this.mostrarConfirmacion = false;
      }
    });
  }
}
