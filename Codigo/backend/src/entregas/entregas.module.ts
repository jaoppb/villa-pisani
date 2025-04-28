import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntregasService } from './entregas.service';
import { EntregasController } from './entregas.controller';
import { Entrega } from './entities/entrega.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entrega]) // Registra a entidade Entrega para injeção no repositório
  ],
  controllers: [EntregasController],
  providers: [EntregasService],
  exports: [EntregasService] // Opcional, exporta o service se precisar em outros módulos
})
export class EntregasModule {}
