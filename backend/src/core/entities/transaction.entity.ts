import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './account.entity';
import { Branch } from './branch.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column()
  type: string; 

  @Column()
  direction: string

  @Column({ nullable: true })
  transactionGroupId?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Account, (account) => account.transactions, { onDelete: 'CASCADE' })
  account: Account;

}