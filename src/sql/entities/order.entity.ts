import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Customer } from "./customer.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @Column("decimal", { precision: 10, scale: 2 })
  total: number;
}
