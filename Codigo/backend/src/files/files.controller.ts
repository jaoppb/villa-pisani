import {
	Controller,
	ForbiddenException,
	Get,
	Param,
	Res,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller('files')
export class FileServeController {
	@Get('*path')
	serveFile(@Param('path') path: string[], @Res() response: Response) {
		const finalPath = join(__dirname, '../..', 'files', path.join('/'));
		if (!finalPath.startsWith(join(__dirname, '../..', 'files'))) {
			throw new ForbiddenException("You shouldn't be here");
		}
		return response.sendFile(finalPath);
	}
}
