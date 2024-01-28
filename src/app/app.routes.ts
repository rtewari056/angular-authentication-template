import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: '', 
        pathMatch: 'full' 
    },
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    }
];
