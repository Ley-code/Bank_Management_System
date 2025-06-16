import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Customer } from "./customer.entity";

export enum NotificationType {
  LOAN_REMINDER = 'LOAN_REMINDER',
  LOAN_OVERDUE = 'LOAN_OVERDUE',
  TRANSACTION = 'TRANSACTION',
  PROMOTION = 'PROMOTION',
  SYSTEM_UPDATE = 'SYSTEM_UPDATE',
  GENERAL = 'GENERAL',
}
@Entity()
export class AppNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, customer => customer.notifications, { onDelete: 'CASCADE' })
  customer: Customer;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType; // e.g. LOAN_REMINDER, TRANSACTION_ALERT, PROMOTION

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true })
  relatedAccountId?: string;

  @Column({ nullable: true })
  relatedLoanId?: string;

  @Column({ nullable: true })
  relatedTransactionId?: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
