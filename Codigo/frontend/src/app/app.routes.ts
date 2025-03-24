import { Routes } from '@angular/router';
import { Error404Component } from './pages/error404/error404.component';
import { OutletComponent } from './pages/auth/outlet/outlet.component';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'home',
	},
	{
		path: '',
		loadChildren: () => 
		import('./pages/home/home.routes').then(
			(module_) => module_.routes,
		),
	},
	{
		path: 'auth',
		component: OutletComponent,
		// outlet: 'auth',
		loadChildren: () =>
			import('./pages/auth/auth.routes').then(
				(module_) => module_.routes,
			),
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
