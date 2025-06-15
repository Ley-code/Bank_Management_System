import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Transaction } from "typeorm";
import { Account } from "./account.entity";
import { Branch } from "./branch.entity";
import { Payment } from "./payment.entity";
import { LoanRequest, LoanType } from "./loanRequest.entity";

export enum LoanStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    OVERDUE = 'OVERDUE',  
}

@Entity()
export class Loan{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp', nullable: true })
    dueDate: Date;

    @Column({ type: 'int' })
    loanDurationInMonths: number;

    @Column({ type: 'enum',  enum: LoanStatus, default: LoanStatus.IN_PROGRESS })
    status: LoanStatus; 

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.07 }) // Default interest rate of 7%
    interestRate: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    monthlyPayment: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    totalPayable: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    issuedAt: Date;

    @Column({ nullable: true })
    approvedBy: string;

    @ManyToOne(() => Account, (account) => account.loans, { onDelete: 'CASCADE' })
    account: Account; 

    @ManyToOne(() => Branch, (branch) => branch.loans, { onDelete: 'SET NULL' })
    branch: Branch; 

    @OneToMany(() => Payment, (payment) => payment.loan)
    payments: Payment[]

    @OneToOne(() => LoanRequest, loanRequest => loanRequest.loan, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn()
    loanRequest: LoanRequest;

}