import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChacraService, Chacra } from '../chacra.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chacrascards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chacrascards.component.html',
  styleUrls: ['./chacrascards.component.css']
})
export class ChacrascardsComponent implements OnChanges {
  @Input() filters: { nombre?: string; ubicacion?: string; dueno?: string } = {};

  allChacras: Chacra[] = [];
  chacrasFiltradas: Chacra[] = [];
  loading = false;
  error = '';

  constructor(private chacraService: ChacraService, private router: Router) {}

  ngOnInit(): void {
    this.cargarChacras();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] && this.allChacras.length > 0) {
      this.aplicarFiltros();
    }
  }

  // 🔹 Cargar chacras desde backend
  cargarChacras() {
    this.loading = true;
    this.error = '';

    this.chacraService.getPublicChacras().subscribe({
      next: (data) => {
        this.allChacras = data.map((c) => ({
          ...c,
          imagenUrl: c.imagenUrl.startsWith('http')
            ? c.imagenUrl
            : `http://localhost:8080${c.imagenUrl}`
        }));

        this.chacrasFiltradas = [...this.allChacras];
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener chacras:', err);
        this.error = 'No se pudieron cargar las chacras.';
        this.loading = false;
      }
    });
  }

  // 🔹 Aplicar filtros recibidos desde barra de búsqueda / filtros
  aplicarFiltros() {
    const { nombre, ubicacion, dueno } = this.filters;

    this.chacrasFiltradas = this.allChacras.filter((c) =>
      (!nombre || c.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
      (!ubicacion || c.ubicacion.toLowerCase().includes(ubicacion.toLowerCase())) &&
      (!dueno || (c.usuarioEmail && c.usuarioEmail.toLowerCase().includes(dueno.toLowerCase())))
    );
  }

  // ⭐ NUEVO: ir al portal / vista individual de la chacra
  irADetalle(chacra: Chacra) {
    this.router.navigate(['/chacras', chacra.id], {
      state: { chacra }
    });
  }
}
