import { Routes } from '@angular/router';
import { LoginformComponent } from './loginform/loginform.component';
import { RegisterformComponent } from './registerform/registerform.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HomeadminComponent } from './homeadmin/homeadmin.component';
import { HomeuserComponent } from './homeuser/homeuser.component';
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // ruta por defecto
  { path: 'login', component: LoginformComponent },
  { path: 'register', component: RegisterformComponent },
  { path: 'home', component: HomepageComponent},
  { path: 'homeadmin', component: HomeadminComponent},
  { path: 'homeuser', component: HomeuserComponent},
  { path: '**', redirectTo: 'home' } // 404 redirige al login
];




