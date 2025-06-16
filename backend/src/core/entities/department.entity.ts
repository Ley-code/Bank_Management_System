import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Department {

    @PrimaryGeneratedColumn()
    name: string; // e.g., 'Finance', 'Cashier', 'HR', 'Staff'

    @Column()
    floorNumber: string;

    @Column()
    buildingNumber: string;

    @Column({ nullable: true })
    description?: string; // optional, for extra info

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToMany(() => Employee, employee => employee.department)
    employees: Employee[];
}
