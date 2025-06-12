import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Transaction } from "typeorm";
import { Account } from "./account.entity";
import { Branch } from "./branch.entity";
import { Payment } from "./payment.entity";

@Entity()
export class Loan{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    issuedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    dueDate: Date;

    @Column({ type: 'varchar', length: 100 })
    status: string; // e.g., 'pending', 'approved', 'rejected', 'paid'
    @ManyToOne(() => Account, (account) => account.loans, { onDelete: 'CASCADE' })
    account: Account; // Reference to the account associated with the loan
    @ManyToOne(() => Branch, (branch) => branch.loans, { onDelete: 'SET NULL' })
    branch: Branch; // Reference to the branch where the loan was issued

    @OneToMany(() => Payment, (payment) => payment.loan)
    payments: Payment[]
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
    @Column({ type: 'varchar', length: 100, nullable: true })
    borrowerName?: string; // Name of the borrower           
}