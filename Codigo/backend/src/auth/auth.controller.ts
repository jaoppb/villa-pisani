import {
	Body,
	Controller,
	Get,
	Logger,
	Post,
	Request as RequestDecorator,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Public } from './meta/public.decorator';
import { Request } from 'src/http/request';
import { CurrentUserDto } from './dto/current-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
	private readonly logger = new Logger(AuthController.name);
	constructor(
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
	) {}

	@Public()
	@Post('signup')
	async signUp(@Body() body: SignUpAuthDto) {
		const user = await this.authService.signUp(body);

		const result = {
			id: user.id,
			name: user.name,
			email: user.email,
			createAt: user.createAt,
			updateAt: user.updateAt,
		};
		return result;
	}

	@Public()
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

	@ApiBearerAuth()
	@Get('me')
	profile(@RequestDecorator() req: Request): CurrentUserDto {
		const { user } = req;

		const result: CurrentUserDto = {
			id: user.id,
			name: user.name,
			email: user.email,
			createAt: user.createAt,
			updateAt: user.updateAt,
			birthDate: user.birthDate,
			roles: user.roles,
		};

		return result;
	}
}
