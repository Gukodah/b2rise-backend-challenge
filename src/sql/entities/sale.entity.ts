import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product: string;

  @Column()
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;
}
