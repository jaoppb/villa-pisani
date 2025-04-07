import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { FeedbackComponent } from "./feedback/feedback.component";

export const routes:Routes = [
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
	}
]