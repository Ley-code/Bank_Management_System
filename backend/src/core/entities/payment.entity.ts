import { Entity } from "typeorm";
import { PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Loan } from "./loan.entity";

@Entity()
export class Payment{
    @PrimaryGeneratedColumn()
    paymentNumber: number;

    @Column({ type: 'date' })
    paymentDate: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    paymentAmount: number;

    @ManyToOne(() => Loan, loan => loan.payments, { nullable: false })
    loan: Loan;
}