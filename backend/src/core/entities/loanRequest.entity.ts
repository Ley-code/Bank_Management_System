import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";
import { Loan } from "./loan.entity";

export enum LoanType {
    PERSONAL = 'personal',
    BUSINESS = 'business',
    MORTGAGE = 'mortgage',
    CAR = 'auto',
    STUDENT = 'student',
    OTHER = 'other'
}

export enum EmploymentStatus {
    EMPLOYED = 'employed',
    BUSINESS_OWNER = 'business-owner',
    SELF_EMPLOYED = 'self-employed',
    RETIRED = 'retired',
    STUDENT = 'student',
    OTHER = 'other'
}

export enum LoanRequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

@Entity()
export class LoanRequest {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ type: 'varchar', length: 100 })
    purpose: string;

    // Consider using integer for duration (e.g., months)
    @Column({ type: 'int' })
    loanDuration: number;

    @Column({ type: 'enum', enum: LoanType, default: LoanType.PERSONAL })
    loanType: LoanType;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    monthlyIncome: number;

    @Column({ type: 'enum', enum: EmploymentStatus, default: EmploymentStatus.EMPLOYED })
    employmentStatus: EmploymentStatus;

    @Column({ type: 'varchar', length: 100, nullable: true })
    employerName?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    employerContact?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    employmentDuration?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    requestedAt: Date;

    @Column({ type: 'enum', enum: LoanRequestStatus, default: LoanRequestStatus.PENDING })
    status: LoanRequestStatus;

    @ManyToOne(() => Account, account => account.loanRequests, { nullable: false, onDelete: 'CASCADE' })
    account: Account;

    @OneToOne(() => Loan, loan => loan.loanRequest, { nullable: true })
    loan: Loan;

}