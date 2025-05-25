import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('regras')
export class Regra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column('text')
  descricao: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;
}
