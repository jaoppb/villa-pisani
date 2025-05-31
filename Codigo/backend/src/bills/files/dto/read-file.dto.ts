import { OmitType } from '@nestjs/swagger';
import { BillFile } from '../entities/file.entity';

export class ReadBillFileDto extends OmitType(BillFile, ['bill'] as const) {
	url: string;

	constructor(billFile: BillFile) {
		super();
		Object.assign(this, billFile);
		delete this['bill'];

		this.url = billFile.getUrl();
	}
}
