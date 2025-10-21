import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]],
    });
  }

  // 🧩 Maneja el envío del formulario
  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor ingresa tus credenciales correctamente.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        // ✅ Si el login fue exitoso, pedimos el usuario actual
        this.authService.getCurrentUser().subscribe({
          next: (user) => {
            console.log('Usuario autenticado:', user);

            // Redirige según el rol o tipo de usuario
            if (user.rol === 'ADMIN' || user.role === 'ADMIN') {
              this.router.navigate(['/homeadmin']);
            } else {
              this.router.navigate(['/homeuser']);
            }
          },
          error: () => {
            this.errorMessage = 'Error al obtener datos del usuario.';
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.errorMessage = 'Credenciales incorrectas o error de conexión.';
        this.loading = false;
      },
    });
  }

  // ✅ Redirige al registro
  goRegister() {
    this.router.navigate(['/register']);
  }

  // ✅ Redirige al inicio (correctamente con Router)
  goHome() {
    this.router.navigate(['/home']);
  }
}
