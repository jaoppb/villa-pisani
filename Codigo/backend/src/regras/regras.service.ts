import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Regra } from './entity/regra.entity';
import { CreateRegraDto } from './dto/create-regra.dto';
import { UpdateRegraDto } from './dto/update-regra.dto';

@Injectable()
export class RegrasService {
	constructor(
		@InjectRepository(Regra)
		private regraRepository: Repository<Regra>,
	) {}

	findAll() {
		return this.regraRepository.find();
	}

	findOne(id: number) {
		return this.regraRepository.findOneBy({ id });
	}

	create(data: CreateRegraDto) {
		const novaRegra = this.regraRepository.create(data);
		return this.regraRepository.save(novaRegra);
	}

	update(id: number, data: UpdateRegraDto) {
		return this.regraRepository.update(id, data);
	}

	remove(id: number) {
		return this.regraRepository.delete(id);
	}
}
