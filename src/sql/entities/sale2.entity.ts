import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Sale2 {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  quantity: number;

  @ManyToOne(() => Product, (product) => product.sales)
  product: Product;
}
