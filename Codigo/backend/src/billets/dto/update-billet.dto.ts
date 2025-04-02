import { PartialType } from '@nestjs/swagger';
import { CreateBilletDto } from './create-billet.dto';

export class UpdateBilletDto extends PartialType(CreateBilletDto) {}
