import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account_id: number;

  @Column("date")
  transaction_date: string;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;
}
