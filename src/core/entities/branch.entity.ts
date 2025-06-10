import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class Branch {
    @PrimaryColumn({ type: 'varchar', length: 100 })
    branchName: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    city?: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    totalDeposits?: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    totalWithdrawals?: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    totalLoans?: number;

    //createdAt and updatedAt fields
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
    // A branch can have multiple accounts
    @OneToMany(() => Account, (account) => account.branch)
    accounts: Account[];
}