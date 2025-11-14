import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChacraService, Chacra } from '../chacra.service';

@Component({
  selector: 'app-chacra-portal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chacra-portal.component.html',
  styleUrls: ['./chacra-portal.component.css']
})
export class ChacraPortalComponent implements OnInit {

  chacra: Chacra | null = null;
  cargando = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private chacraService: ChacraService,
    private router: Router           // 👈 importante para navegar
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.errorMessage = 'ID inválida';
      this.cargando = false;
      return;
    }

    const id = Number(idParam);

    this.chacraService.getPublicChacras().subscribe({
      next: (lista) => {
        const encontrada = lista.find(c => c.id === id) || null;

        if (encontrada) {
          this.chacra = {
            ...encontrada,
            imagenUrl: encontrada.imagenUrl.startsWith('http')
              ? encontrada.imagenUrl
              : `http://localhost:8080${encontrada.imagenUrl}`
          };
        } else {
          this.errorMessage = 'Chacra no encontrada';
        }

        this.cargando = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar la chacra';
        this.cargando = false;
      }
    });
  }

  // 🔙 ESTE ES EL MÉTODO QUE FALTABA
  volverHome(): void {
    this.router.navigate(['/home']); // cambia '/home' si tu ruta se llama distinto
  }
}
