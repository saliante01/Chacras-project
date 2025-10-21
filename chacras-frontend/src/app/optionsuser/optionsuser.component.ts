import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-optionsuser',
  imports: [],
  templateUrl: './optionsuser.component.html',
  styleUrls: ['./optionsuser.component.css']
})
export class OptionsuserComponent {
  // Emit the option key when a card is clicked. You can hook into this
  // from a parent component or replace with navigation logic later.
  @Output() optionSelected = new EventEmitter<string>();

  constructor(private router: Router) {}

  onOptionClick(optionKey: string) {
    // Placeholder: keep emitting for backward compatibility
    console.log('Option clicked:', optionKey);
    this.optionSelected.emit(optionKey);

    // Navigate according to the option pressed
    switch (optionKey) {
      case 'option1':
        this.router.navigate(['/createform']);
        break;
 
    }
  }

}
