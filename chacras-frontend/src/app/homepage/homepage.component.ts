import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { ChacrascardsComponent } from "../chacrascards/chacrascards.component";

@Component({
  selector: 'app-homepage',
  imports: [NavbarComponent, ChacrascardsComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  filters = {};

  onSearch(filters: any) {
    this.filters = filters;
  }
}