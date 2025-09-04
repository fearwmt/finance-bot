import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  type: 'income' | 'expense';

  @Column('float')
  amount: number;

  @Column()
  date: string;
}
