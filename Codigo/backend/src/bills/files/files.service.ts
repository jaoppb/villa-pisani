import { Injectable } from '@nestjs/common';
import { Bill } from '../entities/bill.entity';
import { createWriteStream, existsSync, mkdirSync, unlink } from 'fs';
import { get } from 'https';
import { FileServeController } from 'src/files/files.controller';
import { AppConfigService } from 'src/app-config/app-config.service';

@Injectable()
export class BillFilesService {
	constructor(private readonly appConfigService: AppConfigService) {}

	static readonly FOLDER = 'bills';

	private _createFolder() {
		if (!existsSync(this._dir)) {
			mkdirSync(this._dir, { recursive: true });
		}
	}

	private get _dir() {
		return `${FileServeController.ROOT}/${BillFilesService.FOLDER}`;
	}

	private _getFilePath(bill: Bill): string {
		return `${this._dir}/${(bill.createdAt ?? new Date()).getFullYear()}-${bill.refer}-${bill.apartment.number}.pdf`;
	}

	download(bill: Bill, url: string): Promise<string> {
		return new Promise((res, rej) => {
			const path = this._getFilePath(bill);
			this._createFolder();
			const file = createWriteStream(path);
			get(url, (response) => {
				response.pipe(file);
				file.on('finish', () => {
					file.close();
					res(path.replace(FileServeController.ROOT + '/', ''));
				});
			}).on('error', (err) => {
				rej(err);
			});
		});
	}

	deleteFile(bill: Bill) {
		return new Promise((res, rej) => {
			const path = this._getFilePath(bill);
			if (!existsSync(path)) res(true);
			unlink(path, (err) => {
				if (err) {
					rej(err);
				} else {
					res(true);
				}
			});
		});
	}
}
