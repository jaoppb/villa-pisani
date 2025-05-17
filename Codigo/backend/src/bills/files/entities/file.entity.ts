import { Bill } from 'src/bills/entities/bill.entity';
import { File } from 'src/files/entities/file.entity';
import { Entity, OneToOne, Relation } from 'typeorm';

@Entity()
export class BillFile extends File {
	@OneToOne(() => Bill, (bill) => bill.file)
	bill: Relation<Bill>;
}
