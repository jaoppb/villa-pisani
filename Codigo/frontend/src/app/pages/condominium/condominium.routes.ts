import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { ExpensesComponent } from "./expenses/expenses.component";
import { UsersComponent } from "./users/users.component";
import { ApartmentsComponent } from "./apartments/apartments.component";
import { ApartmentComponent } from "./apartment/apartment.component";
import { ApartmentGuard, IsAdminGuard, IsLoggedInGuard } from "../../guards/authenticate.guard";
import { inject } from "@angular/core";
import { DeliveryComponent } from "./delivery/delivery.component";
import { DeliverysComponent } from "./deliverys/deliverys.component";
import { RulesComponent } from "./rules/rules.component";

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
		component: UsersComponent,
		canMatch: [IsAdminGuard],
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
		data: { isDetailView: true },
		canMatch: [IsAdminGuard],
	},
	{
		path: 'apartment',
		pathMatch: 'full',
		component: ApartmentComponent,
		canMatch: [ApartmentGuard],
	},
	{
		path: 'delivery',
		pathMatch: 'full',
		component: DeliverysComponent,
	},
	{
		path: 'delivery/:id',
		component: DeliveryComponent,
		data: { isDetailView: true },
	},
	{
		path: 'rules',
		component: RulesComponent
	}
]
