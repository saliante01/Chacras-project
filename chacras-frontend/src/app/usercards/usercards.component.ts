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

  constructor(private chacraService: ChacraService, private router: Router) {}

  ngOnInit(): void {
    this.cargarChacras();
  }

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

  abrirPop(chacra: Chacra) {
    this.usuarioSeleccionado = chacra;
  }

  cerrarPop(event: Event) {
    event.stopPropagation();
    this.usuarioSeleccionado = null;
    this.mostrarConfirmacion = false;
  }

  irAActualizar(chacra: Chacra) {
    this.router.navigate(['/updateform'], { state: { chacra } });
  }

  abrirConfirmacion() {
    this.mostrarConfirmacion = true;
  }

  cerrarConfirmacion(event: Event) {
    event.stopPropagation();
    this.mostrarConfirmacion = false;
  }

  confirmarBorrado() {
    if (!this.usuarioSeleccionado) return;
    alert(`Chacra "${this.usuarioSeleccionado.nombre}" eliminada correctamente.`);
    this.chacras = this.chacras.filter(c => c.id !== this.usuarioSeleccionado!.id);
    this.usuarioSeleccionado = null;
    this.mostrarConfirmacion = false;
  }
}
