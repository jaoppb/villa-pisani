import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './custom.logger';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	configLogger(app);
	await app.listen(process.env.API_INTERNAL_PORT ?? 3000);
}

function configLogger(app: INestApplication) {
	const logger = app.get(CustomLogger);
	app.useLogger(logger);
}
bootstrap();
