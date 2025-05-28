import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entrega } from './entities/entrega.entity';
import { CreateEntregaDto } from './dto/create-entrega.dto';

@Injectable()
export class EntregasService {
	constructor(
		@InjectRepository(Entrega)
		private entregaRepository: Repository<Entrega>,
	) {}

	async create(createEntregaDto: CreateEntregaDto): Promise<Entrega> {
		const entrega = this.entregaRepository.create({
			...createEntregaDto,
			dataRecebimento: new Date(), // Marca a data de recebimento na criação
			status: 'PENDENTE', // Define o status inicial
		});
		return this.entregaRepository.save(entrega);
	}

	async findAll(): Promise<Entrega[]> {
		return this.entregaRepository.find();
	}

	async findOne(id: number): Promise<Entrega> {
		const entrega = await this.entregaRepository.findOne({ where: { id } });
		if (!entrega) {
			throw new NotFoundException(`Entrega com ID ${id} não encontrada.`);
		}
		return entrega;
	}

	async confirmarRetirada(id: number): Promise<Entrega> {
		const entrega = await this.findOne(id);
		if (!entrega) {
			throw new NotFoundException('Entrega não encontrada');
		}
		entrega.status = 'RETIRADA';
		entrega.dataRetirada = new Date();
		return this.entregaRepository.save(entrega);
	}

	async remove(id: number): Promise<void> {
		const entrega = await this.findOne(id);
		if (!entrega) {
			throw new NotFoundException('Entrega não encontrada');
		}
		await this.entregaRepository.remove(entrega);
	}
}
