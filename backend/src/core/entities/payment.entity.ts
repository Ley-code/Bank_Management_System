import { Entity } from "typeorm";
import { PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Loan } from "./loan.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Loan, loan => loan.payments, { onDelete: 'CASCADE' })
  loan: Loan;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ default: false })
  isOverdue: boolean;

  @Column({ type: 'text', nullable: true })
  remarks?: string;
}
