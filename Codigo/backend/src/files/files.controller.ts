import {
	Controller,
	ForbiddenException,
	Get,
	Param,
	Res,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { AppConfigService } from 'src/app-config/app-config.service';

@Controller('files')
export class FileServeController {
	constructor(private readonly appConfigService: AppConfigService) {}

	@Get('*path')
	serveFile(@Param('path') path: string[], @Res() response: Response) {
		const finalPath = join(
			this.appConfigService.FileServingPath,
			path.join('/'),
		);
		if (!finalPath.startsWith(this.appConfigService.FileServingPath)) {
			throw new ForbiddenException("You shouldn't be here");
		}
		return response.sendFile(finalPath);
	}
}
