import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
	private readonly logger = new Logger(AppConfigService.name);
	constructor(private readonly config: ConfigService) {
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
			`database port: ${this.config.get<number>('DB_INTERNAL_PORT')}`,
		);
		this.logger.debug(
			`using database user: ${this.config.get<string>('DB_USER')}`,
		);
		this.logger.debug(
			`using database password: ${this.config.get<string>('DB_PASS')}`,
		);
	}

	get LogLevel(): string {
		return this.config.get<string>('API_LOG_LEVEL')!;
	}

	get database() {
		return {
			type: this.config.get<string>('DB_TYPE'),
			name: this.config.get<string>('DB_NAME'),
			host: this.config.get<string>('DB_HOST'),
			port: this.config.get<number>('DB_INTERNAL_PORT'),
			username: this.config.get<string>('DB_USER'),
			password: this.config.get<string>('DB_PASS'),
		};
	}
}
