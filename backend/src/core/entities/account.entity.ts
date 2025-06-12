import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToOne, PrimaryColumn, BeforeInsert } from 'typeorm';
import { Customer } from './customer.entity';
import { Branch } from './branch.entity';
import { Transaction } from './transaction.entity';
import { OneToMany } from 'typeorm';
import { Loan } from './loan.entity';
export enum AccountType {
    SAVINGS = 'SAVINGS',
    CHECKING = 'CHECKING',
    BUSINESS = 'BUSINESS',
}
export enum StatusType {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    CLOSED = 'CLOSED',
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

    @Column({nullable: false, default: 0})
    balance: number;

    @Column({ type: 'enum', enum: StatusType, default: StatusType.ACTIVE })
    status: StatusType; 

    @Column({ type: 'varchar', length: 3, default: 'ETB' }) 
    currencyCode: string;

    @ManyToOne(() => Customer, customer => customer.accounts, { 
        eager: true, 
        onDelete: 'CASCADE'
    })
    customer: Customer;
    
    @ManyToOne(() => Branch, branch => branch.accounts, { 
        eager: true, 
        onDelete: 'SET NULL'
    })
    branch: Branch;

    @OneToMany(() => Transaction, transaction => transaction.account, { cascade: true })
    transactions: Transaction[];

    @OneToMany(()=> Loan, loan => loan.account, {cascade: true} )
    loans: Loan[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
