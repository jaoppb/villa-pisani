// src/entregas/dto/create-entrega.dto.ts

export class CreateEntregaDto {
	descricao: string;
	destinatario: string;
	codigoRastreio?: string; // Opcional
}
