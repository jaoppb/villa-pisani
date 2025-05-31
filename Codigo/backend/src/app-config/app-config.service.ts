import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Address } from './address';

@Injectable()
export class AppConfigService {
	private readonly logger = new Logger(AppConfigService.name);
	private static log = false;
	constructor(private readonly config: ConfigService) {
		if (!AppConfigService.log) {
			this.logger.debug(
				`application log level: ${this.config.get<string>('API_LOG_LEVEL')}`,
			);
			this.logger.debug(
				`database type: ${this.config.get<string>('DB_TYPE')}`,
			);
			this.logger.debug(
				`database name: ${this.config.get<string>('DB_NAME')}`,
			);
			this.logger.debug(
				`database host: ${this.config.get<string>('DB_HOST')}`,
			);
			this.logger.debug(
				`database port: ${this.config.get<number>('DB_PORT')}`,
			);
			this.logger.debug(
				`using database user: ${this.config.get<string>('DB_USER')}`,
			);
			this.logger.debug(
				`using database password: ${this.config.get<string>('DB_PASS')}`,
			);
			this.logger.debug(
				`password encryption size: ${this.config.get<string>('API_PASSWORD_KEY_LENGTH')}`,
			);
			this.logger.debug(
				`salt size: ${this.config.get<string>('API_PASSWORD_SALT_LENGTH')}`,
			);
			this.logger.debug(
				`jwt secret: ${this.config.get<string>('API_JWT_SECRET')}`,
			);
			this.logger.debug(
				`admin email: ${this.config.get<string>('API_ADMIN_EMAIL')}`,
			);
			this.logger.debug(
				`admin password: ${this.config.get<string>('API_ADMIN_PASSWORD')}`,
			);
			this.logger.debug(
				`admin cpf: ${this.config.get<string>('API_ADMIN_CPF')}`,
			);
			this.logger.debug(
				`stripe secret key: ${this.config.get<string>('API_STRIPE_SECRET_KEY')}`,
			);
			this.logger.debug(
				`stripe webhook secret: ${this.config.get<string>(
					'API_STRIPE_WEBHOOK_SECRET',
				)}`,
			);
			this.logger.debug(
				`application environment: ${this.config.get<string>('NODE_ENV')}`,
			);
			this.logger.debug(
				`condominium address: ${this.config.get<string>('API_ADDRESS_STREET')}, ${this.config.get<string>(
					'API_ADDRESS_NUMBER',
				)}, ${this.config.get<string>('API_ADDRESS_CITY')}, ${this.config.get<string>(
					'API_ADDRESS_STATE',
				)}, ${this.config.get<string>('API_ADDRESS_COUNTRY')}, ${this.config.get<string>(
					'API_ADDRESS_CEP',
				)}`,
			);
			this.logger.debug(
				`aws endpoint: ${this.config.get<string>('API_AWS_ENDPOINT')}`,
			);
			this.logger.debug(
				`aws bucket name: ${this.config.get<string>('API_AWS_BUCKET_NAME')}`,
			);
			this.logger.debug(
				`aws access key id: ${this.config.get<string>('API_AWS_ACCESS_KEY_ID')}`,
			);
			this.logger.debug(
				`aws secret access key: ${this.config.get<string>('API_AWS_SECRET_ACCESS_KEY')}`,
			);
			this.logger.debug(
				`aws region: ${this.config.get<string>('API_AWS_REGION')}`,
			);
			this.logger.debug(
				`file serving path: ${this.config.get<string>('API_FILE_SERVING_PATH')}`,
			);
			AppConfigService.log = true;
		}
	}

	get LogLevel(): string {
		return this.config.get<string>('API_LOG_LEVEL')!;
	}

	get PasswordKeyLength(): number {
		return this.config.get<number>('API_PASSWORD_KEY_LENGTH')!;
	}

	get SaltLength(): number {
		return this.config.get<number>('API_PASSWORD_SALT_LENGTH')!;
	}

	get JwtSecret(): string {
		return this.config.get<string>('API_JWT_SECRET')!;
	}

	get AdminEmail(): string {
		return this.config.get<string>('API_ADMIN_EMAIL')!;
	}

	get AdminPassword(): string {
		return this.config.get<string>('API_ADMIN_PASSWORD')!;
	}

	get AdminCPF(): string {
		return this.config.get<string>('API_ADMIN_CPF')!;
	}

	get StripeSecretKey(): string {
		return this.config.get<string>('API_STRIPE_SECRET_KEY')!;
	}

	get StripeWebhookSecret(): string {
		return this.config.get<string>('API_STRIPE_WEBHOOK_SECRET')!;
	}

	get CondominiumAddress(): Address {
		return {
			country: this.config.get<string>('API_ADDRESS_COUNTRY')!,
			city: this.config.get<string>('API_ADDRESS_CITY')!,
			state: this.config.get<string>('API_ADDRESS_STATE')!,
			cep: this.config.get<string>('API_ADDRESS_CEP')!,
			street: this.config.get<string>('API_ADDRESS_STREET')!,
			number: this.config.get<number>('API_ADDRESS_NUMBER')!,
		};
	}

	get AWSEndpoint(): string | undefined {
		return this.config.get<string | undefined>('API_AWS_ENDPOINT');
	}

	get AWSBucketName(): string {
		return this.config.get<string>('API_AWS_BUCKET_NAME')!;
	}

	get AWSAccessKeyId(): string {
		return this.config.get<string>('API_AWS_ACCESS_KEY_ID')!;
	}

	get AWSSecretAccessKey(): string {
		return this.config.get<string>('API_AWS_SECRET_ACCESS_KEY')!;
	}

	get AWSRegion(): string {
		return this.config.get<string>('API_AWS_REGION')!;
	}

	get FileServingPath(): string {
		return this.config.get<string>('API_FILE_SERVING_PATH')!;
	}

	get NodeEnv(): string {
		return this.config.get<string>('NODE_ENV')!;
	}

	get database() {
		return {
			type: this.config.get<string>('DB_TYPE'),
			name: this.config.get<string>('DB_NAME'),
			host: this.config.get<string>('DB_HOST'),
			port: this.config.get<number>('DB_PORT'),
			username: this.config.get<string>('DB_USER'),
			password: this.config.get<string>('DB_PASS'),
		};
	}
}
