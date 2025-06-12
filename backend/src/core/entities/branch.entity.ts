import { Entity, PrimaryColumn, Column, OneToMany} from 'typeorm';
import { Account } from './account.entity';
import { Transaction } from './transaction.entity';
import { Employee } from './employee.entity';
import { Loan } from './loan.entity';

@Entity()
export class Branch {
    @PrimaryColumn({ type: 'varchar', length: 100 })
    branchName: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    city: string;

    @Column({nullable: false, default: 0 })
    totalDeposits: number;

    @Column({nullable: false, default: 0 })
    totalWithdrawals: number;

    @Column({nullable: false, default: 0 })
    totalLoans: number;

    @OneToMany(() => Employee, (employee) => employee.branch)
    employees: Employee[]; 

    @OneToMany(() => Loan, loan => loan.branch)
    loans: Loan[]; // Reference to loans issued at this branch

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => Account, (account) => account.branch)
    accounts: Account[];

}