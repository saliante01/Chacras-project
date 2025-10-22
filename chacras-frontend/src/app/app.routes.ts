import { Routes } from '@angular/router';
import { LoginformComponent } from './loginform/loginform.component';
import { RegisterformComponent } from './registerform/registerform.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HomeadminComponent } from './homeadmin/homeadmin.component';
import { HomeuserComponent } from './homeuser/homeuser.component';
import { UsercreateformComponent } from './usercreateform/usercreateform.component';
import { UserdeleteformComponent } from './userdeleteform/userdeleteform.component';
import { UserupdateformComponent } from './userupdateform/userupdateform.component';
import { HeaderadminComponent } from './headeradmin/headeradmin.component';
import { UpdateformadminComponent } from './updateformadmin/updateformadmin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // ruta por defecto -> login
  { path: 'login', component: LoginformComponent },
  { path: 'register', component: RegisterformComponent },
  { path: 'home', component: HomepageComponent},
  { path: 'homeadmin', component: HomeadminComponent},
  { path: 'homeuser', component: HomeuserComponent},
  { path: 'createform', component: UsercreateformComponent },
  { path: 'deteleform', component: UserdeleteformComponent },
  { path: 'updateform', component: UserupdateformComponent },
  { path: 'headeradmin', component: HeaderadminComponent},
  { path: 'updateformadmin', component: UpdateformadminComponent},
  // helper: accept /deleteform as common spelling and redirect to the existing path
  { path: 'deleteform', redirectTo: 'deteleform' },
  { path: '**', redirectTo: 'home' } // 404 redirige al login
];




