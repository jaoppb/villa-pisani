import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './custom.logger';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	configLogger(app);
	configureSwagger(app);
	await app.listen(process.env.API_INTERNAL_PORT ?? 3000);
}

function configLogger(app: INestApplication) {
	const logger = app.get(CustomLogger);
	app.useLogger(logger);
}

function configureSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('Projeto Patinhas')
		.setDescription('Gerenciador de renda')
		.setVersion('1.0')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document);
}

bootstrap();
