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
	static readonly ROOT = '/app/files';

	@Get('*path')
	serveFile(@Param('path') path: string[], @Res() response: Response) {
		const finalPath = join(
			FileServeController.ROOT,
			'files',
			path.join('/'),
		);
		if (!finalPath.startsWith(join(FileServeController.ROOT, 'files'))) {
			throw new ForbiddenException("You shouldn't be here");
		}
		return response.sendFile(finalPath);
	}
}
