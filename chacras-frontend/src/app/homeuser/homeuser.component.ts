import { Component } from '@angular/core';
import { OptionsuserComponent } from "../optionsuser/optionsuser.component";
import { HeaderuserComponent } from "../headeruser/headeruser.component";
import { ChacrascardsComponent } from "../chacrascards/chacrascards.component";
import { UsercardsComponent } from "../usercards/usercards.component";

@Component({
  selector: 'app-homeuser',
  imports: [OptionsuserComponent, HeaderuserComponent, UsercardsComponent],
  templateUrl: './homeuser.component.html',
  styleUrl: './homeuser.component.css'
})
export class HomeuserComponent {

}
