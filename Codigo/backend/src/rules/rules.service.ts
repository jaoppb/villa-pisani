import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { Rule } from './entities/rule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import EventEmitter2 from 'eventemitter2';
import { Repository } from 'typeorm';

@Injectable()
export class RulesService {
	private readonly logger = new Logger(RulesService.name);

	constructor(
		@InjectRepository(Rule)
		private readonly rulesRepository: Repository<Rule>,
		private readonly eventEmitter: EventEmitter2,
	) {}

	create(dto: CreateRuleDto) {
		const rule = this.rulesRepository.create(dto);
		this.eventEmitter.emit('rule.created', rule);
		this.logger.log(`Rule created: ${JSON.stringify(rule)}`);
		return this.rulesRepository.save(rule);
	}

	findAll() {
		return this.rulesRepository.find();
	}

	async findOne(id: string) {
		const rule = await this.rulesRepository.findOneBy({ id });
		if (!rule) {
			this.logger.warn(`Rule with id ${id} not found`);
			throw new NotFoundException(`Rule with id ${id} not found`);
		}
		return rule;
	}

	async update(id: string, dto: UpdateRuleDto) {
		const rule = await this.findOne(id);
		if (!rule) {
			this.logger.warn(`Rule with id ${id} not found for update`);
			throw new NotFoundException(`Rule with id ${id} not found`);
		}
		this.rulesRepository.merge(rule, dto);
		const updatedRule = await this.rulesRepository.save(rule);
		return updatedRule;
	}

	async remove(id: string) {
		const rule = await this.findOne(id);
		if (!rule) {
			this.logger.warn(`Rule with id ${id} not found for removal`);
			throw new NotFoundException(`Rule with id ${id} not found`);
		}
		await this.rulesRepository.remove(rule);
		return {
			message: `Rule with id ${id} removed successfully`,
		};
	}
}
