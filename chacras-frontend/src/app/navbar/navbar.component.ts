import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Chacra {
  nombre: string;
  ubicacion: string;
  dueno: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // Datos simulados (mismos que en chacrascards)
  private allChacras: Chacra[] = [
    { nombre: 'Chacra Los Álamos', ubicacion: 'Temuco', dueno: 'Sebastián' },
    { nombre: 'Fundo Santa Clara', ubicacion: 'Villarrica', dueno: 'María' },
    { nombre: 'El Mirador', ubicacion: 'Pucón', dueno: 'Carlos' },
    { nombre: 'Las Rosas', ubicacion: 'Temuco', dueno: 'Sebastián' }
  ];

  // Campos del formulario
  nombre = '';
  ubicacion = '';
  dueno = '';

  // Dropdown de sugerencias
  sugerencias: string[] = [];
  campoActivo: 'nombre' | 'ubicacion' | 'dueno' | null = null;

  @Output() search = new EventEmitter<{ nombre: string; ubicacion: string; dueno: string }>();

  onInputChange(value: string, campo: 'nombre' | 'ubicacion' | 'dueno') {
    this.campoActivo = campo;
    const campoLower = campo.toLowerCase();
    const resultados = this.allChacras.map(c => c[campoLower as keyof Chacra]);

    this.sugerencias = resultados
      .filter((item, index, self) =>
        item.toLowerCase().includes(value.toLowerCase()) && self.indexOf(item) === index
      )
      .slice(0, 5); // Máximo 5 resultados
  }

  seleccionarSugerencia(valor: string) {
    if (this.campoActivo === 'nombre') this.nombre = valor;
    if (this.campoActivo === 'ubicacion') this.ubicacion = valor;
    if (this.campoActivo === 'dueno') this.dueno = valor;
    this.sugerencias = [];
    this.campoActivo = null;
  }

  onSearch() {
    this.sugerencias = [];
    this.campoActivo = null;
    this.search.emit({
      nombre: this.nombre,
      ubicacion: this.ubicacion,
      dueno: this.dueno
    });
  }

  limpiarCampo(campo: 'nombre' | 'ubicacion' | 'dueno') {
    if (campo === 'nombre') this.nombre = '';
    if (campo === 'ubicacion') this.ubicacion = '';
    if (campo === 'dueno') this.dueno = '';
    this.sugerencias = [];
  }
}
