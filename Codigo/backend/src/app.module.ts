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
import { ExpensesModule } from './expenses/expenses.module';
import { FileServeController } from './files/files.controller';
import { GlobalGuard } from './auth/guards/global.guard';
import { ApartmentsModule } from './apartments/apartments.module';

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
		ApartmentsModule,
	],
	controllers: [AppController, FileServeController],
	providers: [
		AppService,
		CustomLogger,
		{
			provide: APP_GUARD,
			useClass: GlobalGuard,
		},
	],
	exports: [CustomLogger],
})
export class AppModule {}
