import { DataSource } from "typeorm";
import { Sale } from "./entities/sale.entity";
import { User } from "./entities/user.entity";
import { Employee } from "./entities/employee.entity";
import { Order } from "./entities/order.entity";
import { Customer } from "./entities/customer.entity";
import { Sale2 } from "./entities/sale2.entity";
import { Product } from "./entities/product.entity";
import { Category } from "./entities/category.entity";
import { Transaction } from "./entities/transaction.entity";

export const TestDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  entities: [
    Sale,
    User,
    Employee,
    Order,
    Customer,
    Sale2,
    Product,
    Category,
    Transaction,
  ],
  synchronize: true, // Auto-create database schema
  logging: false,
});
