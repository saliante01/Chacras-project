import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-optionsadmin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './optionsadmin.component.html',
  styleUrls: ['./optionsadmin.component.css']
})
export class OptionsadminComponent {

  constructor(private router: Router) {}

  irACrearChacra(): void {
    this.router.navigate(['/homeadmin']);
  }
}
