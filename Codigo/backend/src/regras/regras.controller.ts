import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { RegrasService } from './regras.service';
import { CreateRegraDto } from './dto/create-regra.dto';
import { UpdateRegraDto } from './dto/update-regra.dto';

@Controller('regras')
export class RegrasController {
  constructor(private readonly regrasService: RegrasService) {}

  @Get()
  findAll() {
    return this.regrasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regrasService.findOne(+id);
  }

  @Post()
  create(@Body() data: CreateRegraDto) {
    return this.regrasService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateRegraDto) {
    return this.regrasService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regrasService.remove(+id);
  }
}
