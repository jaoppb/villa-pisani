import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Feedback {
    @PrimaryGeneratedColumn()
    id: number; // Identificador único para o feedback

    @Column('text')
    body: string; // Corpo da mensagem

    @CreateDateColumn()
    sentAt: Date; // Data e hora em que o feedback foi enviado

    @Column({ nullable: true })
    senderId: number; // Identificador do remetente, pode ser nulo para permitir mensagens anônimas

    @Column({ default: false })
    status: boolean; // Status do feedback, por exemplo, se foi tratado ou não
}
