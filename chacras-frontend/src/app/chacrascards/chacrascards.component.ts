import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Chacra {
  id: number;
  nombre: string;
  ubicacion: string;
  dueno: string;
  descripcion: string;
  imagenUrl: string;
}

@Component({
  selector: 'app-chacrascards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chacrascards.component.html',
  styleUrls: ['./chacrascards.component.css']
})
export class ChacrascardsComponent implements OnChanges {
  @Input() filters: { nombre?: string; ubicacion?: string; dueno?: string } = {};

  allChacras: Chacra[] = [
    {
      id: 1,
      nombre: 'Chacra Los Álamos',
      ubicacion: 'Temuco',
      dueno: 'Sebastián',
      descripcion: 'Un hermoso campo rodeado de álamos y vegetación nativa, ideal para descansar y disfrutar la naturaleza.',
      imagenUrl: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 2,
      nombre: 'Fundo Santa Clara',
      ubicacion: 'Villarrica',
      dueno: 'María',
      descripcion: 'Cuenta con amplios terrenos agrícolas y una vista espectacular al volcán Villarrica.',
      imagenUrl: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 3,
      nombre: 'El Mirador',
      ubicacion: 'Pucón',
      dueno: 'Carlos',
      descripcion: 'Ubicada en una colina con vista al lago, perfecta para turismo rural y fotografía.',
      imagenUrl: 'https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 4,
      nombre: 'Las Rosas',
      ubicacion: 'Temuco',
      dueno: 'Sebastián',
      descripcion: 'Chacra dedicada a la producción de flores y miel artesanal, rodeada de naturaleza.',
      imagenUrl: 'https://images.pexels.com/photos/158827/field-corn-corn-field-farm-158827.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  chacrasFiltradas: Chacra[] = [...this.allChacras];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.aplicarFiltros();
    }
  }

  aplicarFiltros() {
    const { nombre, ubicacion, dueno } = this.filters;

    this.chacrasFiltradas = this.allChacras.filter(c =>
      (!nombre || c.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
      (!ubicacion || c.ubicacion.toLowerCase().includes(ubicacion.toLowerCase())) &&
      (!dueno || c.dueno.toLowerCase().includes(dueno.toLowerCase()))
    );
  }
}
