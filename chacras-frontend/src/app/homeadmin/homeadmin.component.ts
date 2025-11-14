import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HeaderuserComponent } from "../headeruser/headeruser.component";

@Component({
  selector: 'app-homeadmin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderuserComponent],
  templateUrl: './homeadmin.component.html',
  styleUrls: ['./homeadmin.component.css']
})
export class HomeadminComponent {
  form!: FormGroup;
  file?: File;
  message = '';
  cargando = false;
  previewUrl: string | ArrayBuffer | null = null;

  private apiUrl = 'http://localhost:8080/api/chacras/full';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      nombre: [''],
      ubicacion: [''],
      descripcion: [''],
      userEmail: ['']   // 👈 AGREGADO
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      const reader = new FileReader();
      reader.onload = e => (this.previewUrl = (e.target as FileReader).result);
      reader.readAsDataURL(this.file);
    }
  }

  onSubmit(): void {
    const { nombre, ubicacion, descripcion, userEmail } = this.form.value;

    if (!nombre || !ubicacion || !userEmail) {
      this.message = '⚠️ Debes completar nombre, ubicación y correo.';
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('ubicacion', ubicacion);
    formData.append('userEmail', userEmail); // 👈 IGUAL QUE EN POSTMAN
    if (descripcion) formData.append('descripcion', descripcion);
    if (this.file) formData.append('file', this.file);

    this.cargando = true;
    this.message = 'Enviando...';

    this.http.post(this.apiUrl, formData, { withCredentials: true }).subscribe({
      next: (res: any) => {
        console.log('✅ Chacra creada:', res);
        this.message = '✅ Chacra creada correctamente.';
        this.cargando = false;
        this.form.reset();
        this.file = undefined;
        this.previewUrl = null;
      },
      error: (err) => {
        console.error('❌ Error al crear chacra:', err);
        this.message = '❌ No se pudo crear la chacra. Revisá los datos.';
        this.cargando = false;
      }
    });
  }
}
