import { Bill } from 'src/bills/entities/bill.entity';
import { File } from 'src/files/entities/file.entity';
import { Entity, OneToOne, Relation } from 'typeorm';
import { LazyMapTo } from 'src/interceptors/meta/lazy-map-to.decorator';

@Entity('bill_files')
@LazyMapTo({
	path: 'bills/files/dto/read-file.dto',
	className: 'ReadBillFileDto',
})
export class BillFile extends File {
	@OneToOne(() => Bill, (bill) => bill.file)
	bill: Relation<Bill>;

	getUrl(): string {
		return `bills/${this.id}`;
	}
}
