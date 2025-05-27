import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegrasService } from './regras.service';
import { RegrasController } from './regras.controller';
import { Regra } from './entity/regra.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Regra])],
	controllers: [RegrasController],
	providers: [RegrasService],
})
export class RegrasModule {}
