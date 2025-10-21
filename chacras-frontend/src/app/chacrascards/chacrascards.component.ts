import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChacraService } from '../chacra.service';
import { Chacra } from '../chacra.service';
@Component({
  selector: 'app-chacrascards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chacrascards.component.html',
  styleUrls: ['./chacrascards.component.css']
})
export class ChacrascardsComponent implements OnInit, OnChanges {
  @Input() filters: { nombre?: string; ubicacion?: string; usuarioEmail?: string } = {};

  allChacras: Chacra[] = [];
  chacrasFiltradas: Chacra[] = [];
  loading = true;
  errorMessage = '';

  constructor(private chacraService: ChacraService) {}

  ngOnInit(): void {
    this.cargarChacras();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] && this.allChacras.length > 0) {
      this.aplicarFiltros();
    }
  }

  cargarChacras(): void {
    this.loading = true;
    this.chacraService.getChacras().subscribe({
      next: (data) => {
        // Ajustamos las rutas de imagen (backend devuelve rutas relativas)
        this.allChacras = data.map(chacra => ({
          ...chacra,
          imagenUrl: `http://localhost:8080${chacra.imagenUrl}`
        }));
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar chacras:', error);
        this.errorMessage = 'No se pudieron cargar las chacras.';
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    const { nombre, ubicacion, usuarioEmail } = this.filters;

    this.chacrasFiltradas = this.allChacras.filter(c =>
      (!nombre || c.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
      (!ubicacion || c.ubicacion.toLowerCase().includes(ubicacion.toLowerCase())) &&
      (!usuarioEmail || c.usuarioEmail.toLowerCase().includes(usuarioEmail.toLowerCase()))
    );
  }
}
