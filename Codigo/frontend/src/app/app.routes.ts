import { Routes } from '@angular/router';
import { Error404Component } from './pages/error404/error404.component';
import { OutletComponent as OutletAuht} from './pages/auth/outlet/outlet.component';
import { OutletComponent as OutletCondominium } from './pages/condominium/outlet/outlet.component';
import { OutletComponent as OutletHome } from './pages/home/outlet/outlet.component';
import { AuthenticateGuard } from './guards/authenticate.guard';
import { inject } from '@angular/core';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'home',
	},
	{
		path: '',
		component: OutletHome,
		loadChildren: () => 
		import('./pages/home/home.routes').then(
			(module_) => module_.routes,
		),
	},
	{
		path: 'auth',
		component: OutletAuht,
		loadChildren: () =>
			import('./pages/auth/auth.routes').then(
				(module_) => module_.routes,
			),
	},
	{
		path: 'condominium',
		component: OutletCondominium,
		loadChildren: () =>
			import('./pages/condominium/condominium.routes').then(
				(module_) => module_.routes,
			),
		
		canMatch: [() => inject(AuthenticateGuard).isLoggedIn()],
	},
	{
		path: '404',
		component: Error404Component
	},
	{
		path: '**',
		pathMatch: 'full',
		redirectTo: '404'
	}
];
