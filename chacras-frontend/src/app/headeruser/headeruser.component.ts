import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service'; // ajusta la ruta según tu estructura

@Component({
  selector: 'app-headeruser',
  standalone: true,
  imports: [],
  templateUrl: './headeruser.component.html',
  styleUrls: ['./headeruser.component.css']
})
export class HeaderuserComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('✅ Sesión cerrada correctamente');

        // 🔹 Limpieza local (por si guardas algo en localStorage)
        localStorage.clear();
        sessionStorage.clear();

        // 🔹 Redirigir al login o home público
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('❌ Error al cerrar sesión:', error);
        // Aunque falle, limpiamos por seguridad
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
