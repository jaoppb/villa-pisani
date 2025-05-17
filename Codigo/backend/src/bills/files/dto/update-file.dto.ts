import { PartialType } from '@nestjs/swagger';
import { CreateBillFileDto } from './create-file.dto';

export class UpdateBillFileDto extends PartialType(CreateBillFileDto) {}
