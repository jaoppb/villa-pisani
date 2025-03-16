import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
	private readonly logger = new Logger(AuthController.name);
	constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
	) {}

	@Post('signup')
	async signUp(@Body() body: SignUpAuthDto) {
		const { email, password } = body;
		const user = await this.authService.signUp(email, password);

		const result = {
			id: user.id,
			email: user.email,
			createAt: user.createAt,
			updateAt: user.updateAt,
		};
		return result;
	}

	@Post('signin')
	async signIn(@Body() body: SignInAuthDto) {
		const { email, password } = body;
		const user = await this.authService.signIn(email, password);

		const payload = {
			email: user.email,
			sub: user.id,
			iss: 'login',
		};

		const options: JwtSignOptions = {};

		const accessToken = this.jwtService.sign(payload, options);
		this.logger.debug(`Access token generated: ${accessToken}`);
		return { accessToken };
	}
}
