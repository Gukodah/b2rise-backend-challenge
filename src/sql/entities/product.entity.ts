import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Category } from "./category.entity";
import { Sale } from "./sale.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.product)
  category: Category;

  @OneToMany(() => Sale, (sale) => sale.product)
  sales: Sale[];
}
