import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers/auth.guard';

import { LoginComponent } from './login/login.component';
import { ConsoleComponent } from './console/console.component';

const routes: Routes = [
  { path: 'signin', component: LoginComponent },
  { path: 'console', component: ConsoleComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'signin' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
