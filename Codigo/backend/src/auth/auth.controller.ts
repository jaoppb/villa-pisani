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
import { NoRole } from './roles/no-role.decorator';

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
	async signIn(@Body() dto: SignInAuthDto) {
		const user = await this.authService.signIn(dto);

		const payload = {
			email: user.email,
			sub: user.id,
			roles: user.roles,
			iss: 'login',
		};

		const options: JwtSignOptions = {};

		const accessToken = this.jwtService.sign(payload, options);
		this.logger.debug(`Access token generated: ${accessToken}`);
		return { accessToken };
	}

	@ApiBearerAuth()
	@Get('me')
	@NoRole()
	profile(@RequestDecorator() req: Request): CurrentUserDto {
		const { user } = req;

		return new CurrentUserDto(user);
	}
}
