import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-loginform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.css']
})
export class LoginformComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]],
    });
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa correctamente los campos.';
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('✅ Login exitoso:', res);

        // Guardar el rol localmente (opcional)
        localStorage.setItem('userEmail', res.email);
        localStorage.setItem('userRol', res.rol);

        // Redirigir según el rol
        if (res.rol === 'ADMIN') {
          this.router.navigate(['/headeradmin']);
        } else {
          this.router.navigate(['/homeuser']);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        this.errorMessage = err.message || 'Error al iniciar sesión.';
        this.loading = false;
      }
    });
  }
}
