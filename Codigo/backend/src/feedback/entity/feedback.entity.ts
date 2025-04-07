// src/feedback/feedback.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  body: string;

  @CreateDateColumn()
  sentAt: Date;

  @Column({ nullable: true })
  senderId: number;  

  @Column({ default: false })
  status: boolean;
}
