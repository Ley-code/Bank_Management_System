import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";
import { ManyToMany, JoinTable } from "typeorm";
import { AppNotification } from "./notification.entity";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    fullName: string;
    @Column()
    email: string;
    @Column()
    phone: string;
    @Column()
    city: string;
    @Column()
    subCity: string;
    @Column()
    woreda: string;
    @Column()
    houseNumber: string;
    @Column()
    zone: string;
    @Column()
    createdAt: Date;
    @Column()
    updatedAt: Date;
    // One customer can have many accounts
    @OneToMany(() => Account, account => account.customer)
    accounts: Account[];

    @OneToMany(() => AppNotification, notification => notification.customer)
    notifications: AppNotification[];

}