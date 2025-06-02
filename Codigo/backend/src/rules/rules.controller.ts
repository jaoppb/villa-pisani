import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { Role } from 'src/auth/roles/role.entity';
import { Roles } from 'src/auth/roles/role.decorator';

@Controller('rules')
export class RulesController {
	constructor(private readonly rulesService: RulesService) {}

	@Post()
	@Roles(Role.MANAGER)
	create(@Body() createRuleDto: CreateRuleDto) {
		return this.rulesService.create(createRuleDto);
	}

	@Get()
	findAll() {
		return this.rulesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.rulesService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.MANAGER)
	update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
		return this.rulesService.update(id, updateRuleDto);
	}

	@Delete(':id')
	@Roles(Role.MANAGER)
	remove(@Param('id') id: string) {
		return this.rulesService.remove(id);
	}
}
