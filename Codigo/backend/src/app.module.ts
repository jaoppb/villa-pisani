import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomLogger } from './custom.logger';
import { AppConfigModule } from './app-config/app-config.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
	imports: [
		AppConfigModule,
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
	],
	controllers: [AppController],
	providers: [AppService, CustomLogger],
	exports: [CustomLogger],
})
export class AppModule {}
