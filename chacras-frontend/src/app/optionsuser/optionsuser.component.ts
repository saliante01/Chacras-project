import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-optionsuser',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './optionsuser.component.html',
  styleUrls: ['./optionsuser.component.css']
})
export class OptionsuserComponent {
  constructor(private router: Router) {}

  // 🔹 Redirige al formulario de creación de chacra
  goToCreateForm(): void {
    this.router.navigate(['/createform']);
  }
}
