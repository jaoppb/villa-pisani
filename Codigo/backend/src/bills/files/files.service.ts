import { BadRequestException, Injectable } from '@nestjs/common';
import { Bill } from '../entities/bill.entity';
import { createWriteStream, existsSync, mkdirSync, unlink } from 'fs';
import { get } from 'https';
import { AppConfigService } from 'src/app-config/app-config.service';
import { IncomingMessage } from 'http';

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
		return `${this.appConfigService.FileServingPath}/${BillFilesService.FOLDER}`;
	}

	private _getFilePath(bill: Bill): string {
		return `${this._dir}/${(bill.createdAt ?? new Date()).getFullYear()}-${bill.refer}-${bill.apartment.number}.pdf`;
	}

	download(bill: Bill, url: string): Promise<string> {
		return new Promise((res, rej) => {
			const path = this._getFilePath(bill);
			const _doRequest = (
				url: string,
				callback: (message: IncomingMessage) => void,
			) => {
				get(url, callback).on('error', (err) => {
					rej(err);
				});
			};
			const _handleRedirect = (response: IncomingMessage) => {
				const first = response.statusCode?.toString().charAt(0);
				if (first === '3') {
					const { location } = response.headers;
					if (!location)
						throw new BadRequestException(
							'Failed to download Boleto',
						);
					return _doRequest(location, (response) => {
						_handleRedirect(response);
					});
				}

				if (first !== '2') {
					throw new BadRequestException('Failed to download Boleto');
				}

				const file = createWriteStream(path);
				response.pipe(file);
				file.on('finish', () => {
					file.close();
					res(
						path.replace(
							this.appConfigService.FileServingPath + '/',
							'',
						),
					);
				});
			};

			this._createFolder();
			_doRequest(url, (response) => {
				_handleRedirect(response);
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
