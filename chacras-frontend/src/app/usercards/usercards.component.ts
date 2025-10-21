import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
  email: string;
  descripcion: string;
  imagenUrl: string;
}

@Component({
  selector: 'app-usercards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usercards.component.html',
  styleUrls: ['./usercards.component.css']
})
export class UsercardsComponent implements OnChanges {
  @Input() filters: { nombre?: string; rol?: string; email?: string } = {};

  allUsuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Sebastián Aliante',
      rol: 'Administrador',
      email: 'sebastian@correo.com',
      descripcion: 'Encargado de la gestión general del sistema y los usuarios.',
      imagenUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 2,
      nombre: 'María González',
      rol: 'Cliente',
      email: 'maria@correo.com',
      descripcion: 'Usuaria activa interesada en la compra de productos agrícolas locales.',
      imagenUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 3,
      nombre: 'Carlos López',
      rol: 'Vendedor',
      email: 'carlos@correo.com',
      descripcion: 'Ofrece servicios de mantenimiento y asesorías agrícolas.',
      imagenUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 4,
      nombre: 'Valentina Rivas',
      rol: 'Cliente',
      email: 'valentina@correo.com',
      descripcion: 'Apasionada por los productos orgánicos y el desarrollo rural sostenible.',
      imagenUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  usuariosFiltrados: Usuario[] = [...this.allUsuarios];
  usuarioSeleccionado: Usuario | null = null;
  mostrarConfirmacion = false;

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) this.aplicarFiltros();
  }

  aplicarFiltros() {
    const { nombre, rol, email } = this.filters;
    this.usuariosFiltrados = this.allUsuarios.filter(u =>
      (!nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
      (!rol || u.rol.toLowerCase().includes(rol.toLowerCase())) &&
      (!email || u.email.toLowerCase().includes(email.toLowerCase()))
    );
  }

  abrirPop(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
  }

  cerrarPop(event: Event) {
    event.stopPropagation();
    this.usuarioSeleccionado = null;
    this.mostrarConfirmacion = false;
  }

  irAActualizar(usuario: Usuario) {
    this.cerrarPop(new Event('close'));
    this.router.navigate(['/updateform'], { state: { usuario } });
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
    alert('Usuario eliminado correctamente.');
    this.allUsuarios = this.allUsuarios.filter(u => u.id !== this.usuarioSeleccionado!.id);
    this.aplicarFiltros();
    this.usuarioSeleccionado = null;
    this.mostrarConfirmacion = false;
  }
}
