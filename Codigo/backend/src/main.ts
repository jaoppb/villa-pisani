import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './custom.logger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import metadata from './metadata';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	configPipe(app);
	configLogger(app);
	await configureSwagger(app);
	configureCors(app);
	await app.listen(process.env.API_INTERNAL_PORT ?? 3000);
}

function configLogger(app: INestApplication) {
	const logger = app.get(CustomLogger);
	app.useLogger(logger);
}

async function configureSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('Villa Pisani')
		.setDescription(
			'Sistema focado em automatizar processos do condomínio Villa Pisani',
		)
		.setVersion('0.1')
		.addBearerAuth()
		.build();
	await SwaggerModule.loadPluginMetadata(metadata);
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document);
}

function configPipe(app: INestApplication) {
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
		}),
	);
}

function configureCors(app: INestApplication) {
	app.enableCors();
}

bootstrap().catch((error) => {
	console.error('Error during bootstrap:', error);
});
