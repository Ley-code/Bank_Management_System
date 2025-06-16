import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Branch } from "./branch.entity";
import { Department } from "./department.entity";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullName: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    position: string; // e.g., 'Manager', 'Teller', 'Customer Service'

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    salary: number; // Monthly salary of the employee

    @ManyToOne(() => Employee, (employee) => employee.id, { onDelete: 'SET NULL' })
    supervisor: Employee; // Reference to the supervisor if applicable

    @ManyToOne(() => Branch, (branch) => branch.employees, { onDelete: 'SET NULL' })
    branch: Branch; // Reference to the branch where the employee works

    @ManyToOne(() => Department, (department) => department.employees, { onDelete: 'SET NULL' })
    department: Department;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
