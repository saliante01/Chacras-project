import { Component } from '@angular/core';
import { OptionsadminComponent } from "../optionsadmin/optionsadmin.component";
import { CardsadminComponent } from "../cardsadmin/cardsadmin.component";
import { HeaderuserComponent } from "../headeruser/headeruser.component";

@Component({
  selector: 'app-headeradmin',
  imports: [OptionsadminComponent, CardsadminComponent, HeaderuserComponent],
  templateUrl: './headeradmin.component.html',
  styleUrl: './headeradmin.component.css'
})
export class HeaderadminComponent {

}
