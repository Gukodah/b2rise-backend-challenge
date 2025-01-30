import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  country: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
