import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-loginform',
  standalone: true, // ✅ necesario si es un componente independiente
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.css'] // ✅ debe ser 'styleUrls' (plural)
})
export class LoginformComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, complete correctamente los campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // 🔹 Simulación de autenticación (sin backend)
    setTimeout(() => {
      const { email, password } = this.loginForm.value;

      if (email === 'test@correo.com' && password === '1234') {
        alert('Inicio de sesión exitoso (simulado)');
        this.loginForm.reset();
      } else {
        this.errorMessage = 'Credenciales incorrectas (simulación).';
      }

      this.loading = false;
    }, 1000);
  }
}
