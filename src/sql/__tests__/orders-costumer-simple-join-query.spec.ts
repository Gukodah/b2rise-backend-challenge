import { DataSource } from "typeorm";
import { TestDataSource } from "../test-data-source";
import { Order } from "../entities/order.entity";
import { Customer } from "../entities/customer.entity";
import { resetSQLiteSequence } from "../utils/reset-sqlite-sequence";

describe("2.4 Consulta com JOIN Simples", () => {
  let datasourceConnection: DataSource;

  beforeAll(async () => {
    datasourceConnection = await TestDataSource.initialize();
  });

  afterAll(async () => {
    await datasourceConnection.destroy();
  });

  beforeEach(async () => {
    await datasourceConnection.getRepository(Order).clear();
    await datasourceConnection.getRepository(Customer).clear();

    await resetSQLiteSequence(datasourceConnection, "order");
    await resetSQLiteSequence(datasourceConnection, "customer");
  });

  const seedData = async (
    customers: Array<{ name: string; country: string }>,
    orders: Array<{ customerId: number; total: number }>,
  ) => {
    const customerRepo = datasourceConnection.getRepository(Customer);
    const orderRepo = datasourceConnection.getRepository(Order);

    const savedCustomers = await customerRepo.save(customers);
    const ordersWithRelations = orders.map((order) => ({
      customer: savedCustomers.find((c) => c.id === order.customerId),
      total: order.total,
    }));

    await orderRepo.save(ordersWithRelations);
  };

  test("should return customers with their total purchases in descending order", async () => {
    await seedData(
      [
        { name: "Alice", country: "US" },
        { name: "Bob", country: "UK" },
        { name: "Charlie", country: "CA" },
      ],
      [
        { customerId: 1, total: 100 },
        { customerId: 1, total: 200 },
        { customerId: 2, total: 300 },
        { customerId: 3, total: 50 },
      ],
    );

    const result = await datasourceConnection
      .getRepository(Customer)
      .createQueryBuilder("customer")
      .innerJoin(Order, "order", "order.customerId = customer.id")
      .select("customer.name", "name")
      .addSelect("SUM(order.total)", "total")
      .groupBy("customer.id")
      .orderBy("total", "DESC")
      .getRawMany();

    expect(result).toEqual([
      { name: "Bob", total: 300 },
      { name: "Alice", total: 300 },
      { name: "Charlie", total: 50 },
    ]);
  });

  test("should exclude customers without orders", async () => {
    await seedData(
      [
        { name: "Alice", country: "US" },
        { name: "Inactive", country: "UK" },
      ],
      [{ customerId: 1, total: 100 }],
    );

    const result = await datasourceConnection
      .getRepository(Customer)
      .createQueryBuilder("customer")
      .innerJoin(Order, "order", "order.customerId = customer.id")
      .select("customer.id", "id")
      .addSelect("customer.name", "name")
      .addSelect("SUM(order.total)", "total")
      .groupBy("customer.id")
      .orderBy("total", "DESC")
      .getRawMany();

    expect(result).toEqual([{ id: 1, name: "Alice", total: 100 }]);
  });

  test("should handle decimal values correctly", async () => {
    await seedData(
      [{ name: "Precision", country: "DE" }],
      [
        { customerId: 1, total: 99.99 },
        { customerId: 1, total: 100.01 },
      ],
    );

    const result = await datasourceConnection
      .getRepository(Customer)
      .createQueryBuilder("customer")
      .innerJoin(Order, "order", "order.customerId = customer.id")
      .select("customer.name", "name")
      .addSelect("SUM(order.total)", "total")
      .groupBy("customer.id")
      .getRawMany();

    expect(parseFloat(result[0].total)).toBeCloseTo(200.0);
  });

  test("should return empty array when no orders exist", async () => {
    await seedData([{ name: "NoOrders", country: "FR" }], []);

    const result = await datasourceConnection
      .getRepository(Customer)
      .createQueryBuilder("customer")
      .innerJoin(Order, "order", "order.customerId = customer.id")
      .select("customer.name", "name")
      .addSelect("SUM(order.total)", "total")
      .groupBy("customer.id")
      .getRawMany();

    expect(result).toEqual([]);
  });

  test("should handle multiple orders per customer", async () => {
    await seedData(
      [{ name: "MultiOrder", country: "JP" }],
      [
        { customerId: 1, total: 50 },
        { customerId: 1, total: 75 },
        { customerId: 1, total: 25 },
      ],
    );

    const result = await datasourceConnection
      .getRepository(Customer)
      .createQueryBuilder("customer")
      .innerJoin(Order, "order", "order.customerId = customer.id")
      .select("customer.name", "name")
      .addSelect("SUM(order.total)", "total")
      .groupBy("customer.id")
      .getRawMany();
    expect(result).toEqual([{ name: "MultiOrder", total: 150 }]);
  });
});
