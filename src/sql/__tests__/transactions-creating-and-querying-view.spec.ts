import { DataSource } from "typeorm";
import { TestDataSource } from "../test-data-source";
import { resetSQLiteSequence } from "../utils/reset-sqlite-sequence";
import { Transaction } from "../entities/transaction.entity";

describe("2.6 Criação e Consulta de uma VIEW", () => {
  let datasourceConnection: DataSource;

  beforeAll(async () => {
    datasourceConnection = await TestDataSource.initialize();

    // Create the monthly_summary view
    await datasourceConnection.query(`
      CREATE VIEW IF NOT EXISTS monthly_summary AS
      SELECT
        account_id,
        strftime('%Y-%m', transaction_date) AS month,
        SUM(amount) AS total_amount
      FROM transactions
      GROUP BY account_id, month;
    `);
  });

  afterAll(async () => {
    await datasourceConnection.query("DROP VIEW IF EXISTS monthly_summary;");
    await datasourceConnection.destroy();
  });

  beforeEach(async () => {
    await datasourceConnection.getRepository(Transaction).clear();
    await resetSQLiteSequence(datasourceConnection, "transaction");
  });

  const seedData = async (
    transactions: Array<{
      account_id: number;
      transaction_date: string;
      amount: number;
    }>,
  ) => {
    await datasourceConnection.getRepository(Transaction).save(transactions);
  };

  test("should create monthly_summary view with correct data", async () => {
    await seedData([
      { account_id: 1, transaction_date: "2023-01-15", amount: 5000 },
      { account_id: 1, transaction_date: "2023-01-20", amount: 3000 },
      { account_id: 2, transaction_date: "2023-01-10", amount: 7000 },
      { account_id: 1, transaction_date: "2023-02-05", amount: 2000 },
    ]);

    const result = await datasourceConnection.query(
      "SELECT * FROM monthly_summary ORDER BY account_id, month;",
    );
    expect(result).toEqual([
      { account_id: 1, month: "2023-01", total_amount: 8000 },
      { account_id: 1, month: "2023-02", total_amount: 2000 },
      { account_id: 2, month: "2023-01", total_amount: 7000 },
    ]);
  });

  test("should filter accounts with transactions over 10,000 in any month", async () => {
    await seedData([
      { account_id: 1, transaction_date: "2023-01-15", amount: 5000 },
      { account_id: 1, transaction_date: "2023-01-20", amount: 6000 },
      { account_id: 1, transaction_date: "2023-02-20", amount: 6000 },
      { account_id: 2, transaction_date: "2023-01-10", amount: 7000 },
      { account_id: 2, transaction_date: "2023-02-05", amount: 4000 },
    ]);

    const result = await datasourceConnection.query(`
      SELECT account_id, month, total_amount
      FROM monthly_summary
      WHERE account_id IN (
        SELECT account_id
        FROM monthly_summary
        WHERE total_amount > 10000
      )
      ORDER BY account_id, month;
    `);

    expect(result).toEqual([
      { account_id: 1, month: "2023-01", total_amount: 11000 },
      { account_id: 1, month: "2023-02", total_amount: 6000 },
    ]);
  });

  test("should exclude accounts with no months over 10,000", async () => {
    await seedData([
      { account_id: 1, transaction_date: "2023-01-15", amount: 5000 },
      { account_id: 1, transaction_date: "2023-01-20", amount: 4000 },
      { account_id: 2, transaction_date: "2023-01-10", amount: 7000 },
      { account_id: 2, transaction_date: "2023-02-05", amount: 4000 },
    ]);

    const result = await datasourceConnection.query(`
        SELECT account_id, month, total_amount
        FROM monthly_summary
        WHERE account_id IN (
          SELECT account_id
          FROM monthly_summary
          WHERE total_amount > 10000
        )
        ORDER BY account_id, month;
      `);

    expect(result).toEqual([]); // No accounts had >10,000 in any month
  });

  test("should handle decimal amounts correctly", async () => {
    await seedData([
      { account_id: 1, transaction_date: "2023-01-15", amount: 5000.5 },
      { account_id: 1, transaction_date: "2023-01-20", amount: 6000.75 },
    ]);

    const result = await datasourceConnection.query(`
        SELECT account_id, month, total_amount
        FROM monthly_summary
        WHERE account_id IN (
          SELECT account_id
          FROM monthly_summary
          WHERE total_amount > 10000
        )
        ORDER BY account_id, month;
      `);

    expect(result).toEqual([
      { account_id: 1, month: "2023-01", total_amount: 11001.25 },
    ]);
  });

  test("should handle multiple months for the same account", async () => {
    await seedData([
      { account_id: 1, transaction_date: "2023-01-15", amount: 12000 },
      { account_id: 1, transaction_date: "2023-02-05", amount: 5000 },
      { account_id: 1, transaction_date: "2023-03-10", amount: 15000 },
    ]);

    const result = await datasourceConnection.query(`
        SELECT account_id, month, total_amount
        FROM monthly_summary
        WHERE account_id IN (
          SELECT account_id
          FROM monthly_summary
          WHERE total_amount > 10000
        )
        ORDER BY account_id, month;
      `);

    expect(result).toEqual([
      { account_id: 1, month: "2023-01", total_amount: 12000 },
      { account_id: 1, month: "2023-02", total_amount: 5000 },
      { account_id: 1, month: "2023-03", total_amount: 15000 },
    ]);
  });
});
