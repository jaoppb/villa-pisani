import { Injectable } from "@angular/core";
import { CanMatchFn } from "@angular/router";
import { AccessTokenService } from "../services/accessToken.service";
import { UserService } from "../services/user.service";
import { map } from "rxjs/operators";

@Injectable({
	providedIn: 'root',
})
export class IsLoggedInGuard {
	constructor(private tokenService: AccessTokenService) {}

	canMatch: CanMatchFn = () => {
		return this.tokenService.hasToken;
	};
}

@Injectable({
	providedIn: 'root',
})
export class IsAdminGuard {
	constructor(private tokenService: AccessTokenService) {}

	canMatch: CanMatchFn = () => {
		return this.tokenService.hasManager;
	};
}

@Injectable({
	providedIn: 'root',
})
export class IsEmployeeGuard {
	constructor(private tokenService: AccessTokenService) {}

	canMatch: CanMatchFn = () => {
		return this.tokenService.hasEmployee;
	};
}

@Injectable({
	providedIn: 'root',
})
export class IsResidentGuard {
	constructor(private tokenService: AccessTokenService) {}

	canMatch: CanMatchFn = () => {
		return this.tokenService.hasInhabitant;
	};
}

@Injectable({
	providedIn: 'root',
})
export class ApartmentGuard {
	constructor(private userService: UserService) {}

	canMatch: CanMatchFn = () => {
		return this.userService.getUserLogin().pipe(
			map((res: any) => !!res.body?.apartment)
		);
	};
}
