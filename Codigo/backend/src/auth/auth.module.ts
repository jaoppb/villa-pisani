import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from 'src/app-config/app-config.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { User } from 'src/user/entities/user.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PublicGuard } from './guards/public.guard';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { GlobalGuard } from './guards/global.guard';

@Module({
	imports: [
		EncryptionModule,
		AppConfigModule,
		PassportModule,
		TypeOrmModule.forFeature([User]),
		EventEmitterModule.forRoot(),
		JwtModule.registerAsync({
			imports: [AppConfigModule],
			inject: [AppConfigService],
			useFactory: (configService: AppConfigService) => ({
				secret: configService.JwtSecret,
				signOptions: { expiresIn: '3d' },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		PasswordEncryption,
		JwtStrategy,
		GlobalGuard,
		PublicGuard,
		AuthGuard,
		RoleGuard,
	],
	exports: [
		AuthService,
		JwtModule,
		JwtStrategy,
		GlobalGuard,
		PublicGuard,
		AuthGuard,
		RoleGuard,
	],
})
export class AuthModule {
	constructor() {}
}
