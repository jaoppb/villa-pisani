import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomLogger } from './custom.logger';
import { AppConfigModule } from './app-config/app-config.module';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/roles/role.guard';
import { ExpensesModule } from './expenses/expenses.module';
import { FileServeController } from './files/files.controller';

@Module({
	imports: [
		AppConfigModule,
		DatabaseModule,
		LoggerModule.forRoot({
			pinoHttp: {
				level: 'trace',
				transport: {
					target: 'pino-pretty',
					options: {
						colorize: true,
						colorizeObjects: true,
					},
				},
			},
		}),
		UserModule,
		AuthModule,
		FeedbackModule,
		ExpensesModule,
	],
	controllers: [AppController, FileServeController],
	providers: [
		AppService,
		CustomLogger,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RoleGuard,
		},
	],
	exports: [CustomLogger],
})
export class AppModule {}
