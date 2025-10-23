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

  private apiUrl = 'http://localhost:8080/api/chacras/admin/create';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      nombre: [''],
      ubicacion: [''],
      userEmail: ['']
    });
  }

  // 📸 Detectar selección de archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      const reader = new FileReader();
      reader.onload = e => (this.previewUrl = (e.target as FileReader).result);
      reader.readAsDataURL(this.file);
    }
  }

  // 📨 Enviar chacra al backend
  onSubmit(): void {
    if (!this.form.value.nombre || !this.form.value.ubicacion || !this.form.value.userEmail) {
      this.message = '⚠️ Debes completar los campos obligatorios.';
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.form.value.nombre);
    formData.append('ubicacion', this.form.value.ubicacion);
    formData.append('userEmail', this.form.value.userEmail);
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
        this.message = '❌ No se pudo crear la chacra. Revisa los datos.';
        this.cargando = false;
      }
    });
  }
}
