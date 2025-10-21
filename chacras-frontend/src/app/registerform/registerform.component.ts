import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-registerform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registerform.component.html',
  styleUrls: ['./registerform.component.css']
})
export class RegisterformComponent {
  registerForm: FormGroup;
  loading = false;

  popupSuccess = false;
  popupError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, complete correctamente todos los campos.';
      this.popupError = true;
      return;
    }

    const { name, email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      this.popupError = true;
      return;
    }

    this.loading = true;

    this.registerService.registerUser({ name, email, password }).subscribe({
      next: () => {
        this.popupSuccess = true;
        this.registerForm.reset();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al registrar usuario.';
        this.popupError = true;
        this.loading = false;
      }
    });
  }

  cerrarPopups() {
    this.popupSuccess = false;
    this.popupError = false;
  }

  goHome() {
    (window as any).location.href = '/home';
  }

  goLogin() {
    (window as any).location.href = '/login';
  }
}
