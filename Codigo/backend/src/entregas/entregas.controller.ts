import { Controller, Post, Get, Patch, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { EntregasService } from './entregas.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';

@Controller('entregas')
export class EntregasController {
  constructor(private readonly entregasService: EntregasService) {}

  @Post()
  async create(@Body() createEntregaDto: CreateEntregaDto) {
    const entrega = await this.entregasService.create(createEntregaDto);
    return entrega;
  }

  @Get()
  async findAll() {
    const entregas = await this.entregasService.findAll();
    return entregas;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const entrega = await this.entregasService.findOne(id);
    return entrega;
  }

  @Patch(':id/confirmar-retirada')
  async confirmarRetirada(@Param('id') id: number) {
    const entregaAtualizada = await this.entregasService.confirmarRetirada(id);
    return entregaAtualizada;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.entregasService.remove(id);
    return null;
  }
}
