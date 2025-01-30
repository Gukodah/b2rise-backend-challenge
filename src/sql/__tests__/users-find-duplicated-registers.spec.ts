import { DataSource } from "typeorm";
import { TestDataSource } from "../test-data-source";
import { User } from "../entities/user.entity";
import { DataSeeder } from "../utils/seed-data";

describe("2.2 Identificar Registros Duplicados", () => {
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
    await datasourceConnection.getRepository(User).clear();
  });

  test("should find duplicates with correct counts", async () => {
    await seeder.seed(User, [
      { email: "user1@example.com", name: "Alice" },
      { email: "user2@example.com", name: "Bob" },
      { email: "user1@example.com", name: "Alice Clone" },
      { email: "user3@example.com", name: "Charlie" },
      { email: "user2@example.com", name: "Bob Duplicate" },
    ]);

    const result = await datasourceConnection
      .getRepository(User)
      .createQueryBuilder("user")
      .select("user.email", "email")
      .addSelect("COUNT(user.id)", "count")
      .groupBy("user.email")
      .having("count > 1")
      .orderBy("count", "DESC")
      .getRawMany();

    expect(result).toEqual([
      { email: "user2@example.com", count: 2 },
      { email: "user1@example.com", count: 2 },
    ]);
  });

  test("should return empty array when no duplicates exist", async () => {
    await seeder.seed(User, [
      { email: "unique1@example.com", name: "Alice" },
      { email: "unique2@example.com", name: "Bob" },
    ]);

    const result = await datasourceConnection
      .getRepository(User)
      .createQueryBuilder("user")
      .select("user.email", "email")
      .addSelect("COUNT(user.id)", "count")
      .groupBy("user.email")
      .having("count > 1")
      .getRawMany();

    expect(result).toEqual([]);
  });

  test("should handle multiple duplicates for same email", async () => {
    await seeder.seed(User, [
      { email: "repeat@example.com", name: "Test 1" },
      { email: "repeat@example.com", name: "Test 2" },
      { email: "repeat@example.com", name: "Test 3" },
    ]);

    const result = await datasourceConnection
      .getRepository(User)
      .createQueryBuilder("user")
      .select("user.email", "email")
      .addSelect("COUNT(user.id)", "count")
      .groupBy("user.email")
      .having("count > 1")
      .getRawMany();

    expect(result).toEqual([{ email: "repeat@example.com", count: 3 }]);
  });

  test("should handle empty table", async () => {
    const result = await datasourceConnection
      .getRepository(User)
      .createQueryBuilder("user")
      .select("user.email", "email")
      .addSelect("COUNT(user.id)", "count")
      .groupBy("user.email")
      .having("count > 1")
      .getRawMany();

    expect(result).toEqual([]);
  });
});
