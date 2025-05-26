// src/entregas/entities/entrega.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Entrega {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  descricao: string;

  @Column()
  destinatario: string;

  @Column({ nullable: true })
  codigoRastreio: string;

  @CreateDateColumn()
  dataRecebimento: Date;

  @Column({ nullable: true })
  dataRetirada: Date;

  @Column({ default: 'PENDENTE' })
  status: 'PENDENTE' | 'RETIRADA';
}
