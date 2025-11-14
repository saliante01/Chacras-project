import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChacraService } from '../chacra.service';
import { HeaderuserComponent } from "../headeruser/headeruser.component";

@Component({
  selector: 'app-updateformadmin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderuserComponent],
  templateUrl: './updateformadmin.component.html',
  styleUrls: ['./updateformadmin.component.css']
})
export class UpdateformadminComponent implements OnInit {
  form!: FormGroup;
  file?: File;
  chacraId?: number;
  previewUrl: string | ArrayBuffer | null = null;
  message = '';

  constructor(
    private fb: FormBuilder,
    private chacraService: ChacraService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔹 Recuperar chacra desde navigation state o sessionStorage
    const navigation = this.router.getCurrentNavigation();
    const chacra =
      navigation?.extras.state?.['chacra'] ||
      JSON.parse(sessionStorage.getItem('chacraEdit') || 'null');

    if (!chacra) {
      alert('No se ha seleccionado ninguna chacra para editar.');
      this.router.navigate(['/headeradmin']);
      return;
    }

    // ✅ Guardamos ID
    this.chacraId = chacra.id;

    // ✅ Cargamos valores iniciales (AGREGADO descripcion)
    this.form = this.fb.group({
      nombre: [chacra.nombre || ''],
      ubicacion: [chacra.ubicacion || ''],
      descripcion: [chacra.descripcion || '']   // 👈 NUEVO
    });

    this.previewUrl = chacra.imagenUrl || null;
  }

  // 📸 Detectar selección de archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = (e.target as FileReader).result;
      reader.readAsDataURL(this.file);
    }
  }

  // 🔙 Volver a homeadmin
  volver(): void {
    this.router.navigate(['/headeradmin']);
  }

  // 💾 Enviar actualización
  onSubmit(): void {
    if (!this.chacraId) return;

    const { nombre, ubicacion, descripcion } = this.form.value; // 👈 incluye descripcion

    const formData = new FormData();
    if (nombre) formData.append('nombre', nombre);
    if (ubicacion) formData.append('ubicacion', ubicacion);
    if (descripcion) formData.append('descripcion', descripcion); // 👈 NUEVO
    if (this.file) formData.append('file', this.file);

    fetch(`http://localhost:8080/api/chacras/${this.chacraId}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData
    })
      .then(async res => {
        if (res.ok) {
          this.message = '✅ Chacra actualizada correctamente';
          setTimeout(() => this.router.navigate(['/headeradmin']), 1200);
        } else {
          const text = await res.text();
          throw new Error(text || 'Error al actualizar chacra');
        }
      })
      .catch(err => {
        console.error('❌ Error en actualización:', err);
        this.message = '❌ Error al actualizar la chacra';
      });
  }
}
