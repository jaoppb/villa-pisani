import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
	private readonly logger = new Logger(AppConfigService.name);
	constructor(private readonly config: ConfigService) {
		this.logger.debug(
			`application log level: ${this.config.get<string>('API_LOG_LEVEL')}`,
		);
	}

	get LogLevel(): string {
		return this.config.get<string>('API_LOG_LEVEL')!;
	}
}
