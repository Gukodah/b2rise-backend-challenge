import { DataSource } from "typeorm";
import { Employee } from "../entities/employee.entity";
import { TestDataSource } from "../test-data-source";
import { DataSeeder } from "../utils/seed-data";

describe("2.3 Atualizar Dados Condicionalmente", () => {
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
    await datasourceConnection.getRepository(Employee).clear();
  });

  test("should update salaries below 5000 with 10% increase", async () => {
    await seeder.seed(Employee, [
      { name: "Alice", salary: 4500 },
      { name: "Bob", salary: 4800 },
      { name: "Charlie", salary: 5000 },
      { name: "David", salary: 5200 },
    ]);

    await datasourceConnection
      .getRepository(Employee)
      .createQueryBuilder()
      .update(Employee)
      .set({
        salary: () => `CASE 
              WHEN salary < 5000 THEN salary * 1.10 
              ELSE salary 
            END`,
      })
      .where("salary < 5000")
      .execute();

    const results = await datasourceConnection.getRepository(Employee).find({
      order: { name: "ASC" },
    });

    expect(results[0].salary).toBeCloseTo(4950); // 4500 * 1.1
    expect(results[1].salary).toBeCloseTo(5280); // 4800 * 1.1
    expect(results[2].salary).toBeCloseTo(5000); // No change
    expect(results[3].salary).toBeCloseTo(5200); // No change
  });

  test("should not update salaries exactly at 5000", async () => {
    await seeder.seed(Employee, [{ name: "EdgeCase", salary: 5000 }]);

    await datasourceConnection
      .getRepository(Employee)
      .createQueryBuilder()
      .update(Employee)
      .set({
        salary: () => `CASE 
              WHEN salary < 5000 THEN salary * 1.10 
              ELSE salary 
            END`,
      })
      .where("salary < 5000")
      .execute();

    const result = await datasourceConnection.getRepository(Employee).findOne({
      where: { name: "EdgeCase" },
    });
    expect(result?.salary).toBeCloseTo(5000);
  });

  test("should not modify any records when all salaries are above threshold", async () => {
    await seeder.seed(Employee, [
      { name: "High1", salary: 6000 },
      { name: "High2", salary: 7500 },
    ]);

    const updateResult = await datasourceConnection
      .getRepository(Employee)
      .createQueryBuilder()
      .update(Employee)
      .set({
        salary: () => `CASE 
              WHEN salary < 5000 THEN salary * 1.10 
              ELSE salary 
            END`,
      })
      .where("salary < 5000")
      .execute();

    expect(updateResult.affected).toBe(0);

    const results = await datasourceConnection.getRepository(Employee).find();
    results.forEach((emp) => {
      expect(emp.salary).toBeGreaterThanOrEqual(5000);
    });
  });

  test("should handle empty table gracefully", async () => {
    const updateResult = await datasourceConnection
      .getRepository(Employee)
      .createQueryBuilder()
      .update(Employee)
      .set({
        salary: () => `CASE 
              WHEN salary < 5000 THEN salary * 1.10 
              ELSE salary 
            END`,
      })
      .where("salary < 5000")
      .execute();

    expect(updateResult.affected).toBe(0);
  });
});
