import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Regra } from './regra.entity';
import { RegrasService } from './regras.service';
import { RegrasController } from './regras.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Regra])],
  controllers: [RegrasController],
  providers: [RegrasService],
})
export class RegrasModule {}
