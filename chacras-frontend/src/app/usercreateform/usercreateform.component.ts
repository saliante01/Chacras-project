import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChacraService } from '../chacra.service';

@Component({
  selector: 'app-usercreateform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usercreateform.component.html',
  styleUrls: ['./usercreateform.component.css']
})
export class UsercreateformComponent {
  form: FormGroup;
  file?: File;
  previewUrl: string | ArrayBuffer | null = null;
  message = '';

  constructor(
    private fb: FormBuilder,
    private chacraService: ChacraService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      ubicacion: ['', Validators.required],
      descripcion: ['']  // 👈 AGREGADO - NO TOQUÉ NADA MAS
    });
  }

  // 📸 Captura del archivo seleccionado
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];

      const reader = new FileReader();
      reader.onload = e => this.previewUrl = (e.target as FileReader).result;
      reader.readAsDataURL(this.file);
    }
  }

  // 🔙 Volver a perfil
  volver(): void {
    this.router.navigate(['/homeuser']);
  }

  // 💾 Crear chacra
  onSubmit(): void {
    if (this.form.invalid || !this.file) return;

    const { nombre, ubicacion, descripcion } = this.form.value;

    // 👇 NO CAMBIÉ el nombre de la función NI el orden NI las variables
    this.chacraService.createChacra(nombre, ubicacion, descripcion, this.file)
      .subscribe({
        next: (response) => {
          console.log('✅ Chacra creada:', response);
          this.message = '✅ Chacra creada correctamente';
          setTimeout(() => this.router.navigate(['/homeuser']), 1500);
        },
        error: (err) => {
          console.error('❌ Error al crear chacra:', err);
          this.message = '❌ Error al crear chacra';
        }
      });
  }
}
