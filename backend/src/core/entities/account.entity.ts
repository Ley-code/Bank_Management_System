import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToOne, PrimaryColumn, BeforeInsert } from 'typeorm';
import { Customer } from './customer.entity';
import { Branch } from './branch.entity';
export enum AccountType {
    SAVINGS = 'SAVINGS',
    CHECKING = 'CHECKING',
    BUSINESS = 'BUSINESS',
}

@Entity()
export class Account {

    @PrimaryColumn({ unique: true, length: 10 })
    accountNumber: string;

    @BeforeInsert()
    generateAccountNumber() {
        this.accountNumber = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
    }

    @Column({ type: 'enum', enum: AccountType })
    accountType: AccountType;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    balance: number;

    @Column({ type: 'varchar', length: 3, default: 'ETB' }) // Assuming USD as default currency
    currencyCode: string;

    @ManyToOne(() => Customer, customer => customer.accounts, { 
        eager: true, 
        onDelete: 'CASCADE' // This enables cascade delete
    })
    customer: Customer;

    @ManyToOne(() => Branch, branch => branch.accounts, { 
        eager: true, 
        onDelete: 'SET NULL' // or 'CASCADE' if you want to delete accounts when a branch is deleted
    })
    branch: Branch;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
