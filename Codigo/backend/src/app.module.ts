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
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ExpensesModule } from './expenses/expenses.module';
import { FileServeController } from './files/files.controller';
import { GlobalGuard } from './auth/guards/global.guard';
import { ApartmentsModule } from './apartments/apartments.module';
import { NoticesModule } from './notices/notices.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { BillsModule } from './bills/bills.module';
import { EntregasModule } from './entregas/entregas.module';
import { RegrasModule } from './regras/regras.module'; // <-- Novo módulo importado
import { DeliveriesModule } from './deliveries/deliveries.module';

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
		NoticesModule,
		BillsModule,
		DeliveriesModule,
		// EntregasModule,
		// RegrasModule,
	],
	controllers: [AppController, FileServeController],
	providers: [
		AppService,
		CustomLogger,
		{
			provide: APP_GUARD,
			useClass: GlobalGuard,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseInterceptor,
		},
	],
	exports: [CustomLogger],
})
export class AppModule {}
