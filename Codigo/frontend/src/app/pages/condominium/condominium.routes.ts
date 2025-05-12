import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { ExpensesComponent } from "./expenses/expenses.component";
import { UsersComponent } from "./users/users.component";
import { ApartmentsComponent } from "./apartments/apartments.component";
import { ApartmentComponent } from "./apartment/apartment.component";

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'home',
	},
	{
		path: 'home',
		component: HomeComponent
	},
	{
		path: 'feedback',
		component: FeedbackComponent
	},
	{
		path: 'expenses',
		component: ExpensesComponent
	},
	{
		path: 'users',
		component: UsersComponent
	},
	{
		path: 'users/:id',
		component: UsersComponent,
		data: { isDetailView: true }
	},
	{
		path: 'apartments',
		component: ApartmentsComponent
	},
	{
		path: 'apartment/:number',
		component: ApartmentComponent,
		data: { isDetailView: true }
	},
]
