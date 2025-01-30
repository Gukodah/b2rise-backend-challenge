import { DataSource } from "typeorm";
import { TestDataSource } from "../test-data-source";
import { Sale } from "../entities/sale.entity";
import { DataSeeder } from "../utils/seed-data";

describe("2.1 Consulta com Agregação", () => {
  let datasourceConnection: DataSource;
  let seeder: DataSeeder;

  beforeAll(async () => {
    datasourceConnection = await TestDataSource.initialize();
    seeder = new DataSeeder(datasourceConnection);
  });

  afterAll(async () => {
    await datasourceConnection.destroy();
  });

  beforeEach(async () => {
    await datasourceConnection.getRepository(Sale).clear();
  });

  test("calculates total revenue per product in descending order", async () => {
    await seeder.seed(Sale, [
      { product: "Apple", quantity: 5, price: 1.5 },
      { product: "Banana", quantity: 3, price: 0.75 },
      { product: "Apple", quantity: 2, price: 1.5 },
    ]);

    const result = await datasourceConnection
      .getRepository(Sale)
      .createQueryBuilder("sales")
      .select("sales.product", "product")
      .addSelect("SUM(sales.quantity * sales.price)", "totalRevenue")
      .groupBy("sales.product")
      .orderBy("totalRevenue", "DESC")
      .getRawMany();

    expect(result).toEqual([
      { product: "Apple", totalRevenue: 10.5 },
      { product: "Banana", totalRevenue: 2.25 },
    ]);
  });

  test("returns empty array when no sales data exists", async () => {
    const result = await datasourceConnection
      .getRepository(Sale)
      .createQueryBuilder("sales")
      .select("sales.product", "product")
      .addSelect("SUM(sales.quantity * sales.price)", "totalRevenue")
      .groupBy("sales.product")
      .orderBy("totalRevenue", "DESC")
      .getRawMany();

    expect(result).toEqual([]);
  });

  test("maintains correct descending order for multiple products", async () => {
    await seeder.seed(Sale, [
      { product: "TV", quantity: 10, price: 500 },
      { product: "Phone", quantity: 20, price: 700 },
      { product: "Laptop", quantity: 5, price: 1500 },
    ]);

    const result = await datasourceConnection
      .getRepository(Sale)
      .createQueryBuilder("sales")
      .select("sales.product", "product")
      .addSelect("SUM(sales.quantity * sales.price)", "totalRevenue")
      .groupBy("sales.product")
      .orderBy("totalRevenue", "DESC")
      .getRawMany();

    expect(result).toEqual([
      { product: "Phone", totalRevenue: 14000 },
      { product: "Laptop", totalRevenue: 7500 },
      { product: "TV", totalRevenue: 5000 },
    ]);
  });

  test("handles decimal precision correctly", async () => {
    await seeder.seed(Sale, [
      { product: "Book", quantity: 2, price: 14.99 },
      { product: "Book", quantity: 3, price: 12.5 },
    ]);

    const result = await datasourceConnection
      .getRepository(Sale)
      .createQueryBuilder("sales")
      .select("sales.product", "product")
      .addSelect("SUM(sales.quantity * sales.price)", "totalRevenue")
      .groupBy("sales.product")
      .orderBy("totalRevenue", "DESC")
      .getRawMany();

    const expectedTotal = 2 * 14.99 + 3 * 12.5;
    expect(parseFloat(result[0].totalRevenue)).toBeCloseTo(expectedTotal, 2);
  });
});
