import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headeruser',
  imports: [],
  templateUrl: './headeruser.component.html',
  styleUrls: ['./headeruser.component.css']
})
export class HeaderuserComponent {
  constructor(private router: Router) {}

  onLogout() {
    // Clear common storage keys used for auth. Adjust as your app uses.
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.clear();
    } catch (e) {
      console.warn('Error clearing storage during logout', e);
    }
    // Navigate to login page
    this.router.navigate(['/home']);
  }

}
