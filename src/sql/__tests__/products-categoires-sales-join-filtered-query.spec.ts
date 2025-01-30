import { DataSource } from "typeorm";
import { TestDataSource } from "../test-data-source";
import { Product } from "../entities/product.entity";
import { Category } from "../entities/category.entity";
import { Sale } from "../entities/sale.entity";
import { resetSQLiteSequence } from "../utils/reset-sqlite-sequence";
import { Sale2 } from "../entities/sale2.entity";

describe("2.5 Consulta com JOIN e Filtragem", () => {
  let datasourceConnection: DataSource;

  beforeAll(async () => {
    datasourceConnection = await TestDataSource.initialize();
  });

  afterAll(async () => {
    await datasourceConnection.destroy();
  });

  beforeEach(async () => {
    await datasourceConnection.getRepository(Sale2).clear();
    await datasourceConnection.getRepository(Product).clear();
    await datasourceConnection.getRepository(Category).clear();

    await resetSQLiteSequence(datasourceConnection, "sale2");
    await resetSQLiteSequence(datasourceConnection, "product");
    await resetSQLiteSequence(datasourceConnection, "category");
  });

  const seedData = async (
    categories: Array<{ name: string }>,
    products: Array<{ name: string; categoryId: number }>,
    sales: Array<{ productId: number; quantity: number }>,
  ) => {
    const categoryRepo = datasourceConnection.getRepository(Category);
    const productRepo = datasourceConnection.getRepository(Product);
    const saleRepo = datasourceConnection.getRepository(Sale2);

    const savedCategories = await categoryRepo.save(categories);

    const productsToSave = products.map((product) => ({
      name: product.name,
      category: savedCategories.find((cat) => cat.id === product.categoryId),
    }));

    const savedProducts = await productRepo.save(productsToSave);

    const salesToSave = sales.map((sale) => ({
      quantity: sale.quantity,
      product: savedProducts.find((prod) => prod.id === sale.productId),
    }));

    await saleRepo.save(salesToSave);
  };

  test("should return categories with products having total sales over 100", async () => {
    await seedData(
      [{ name: "Electronics" }, { name: "Clothing" }],
      [
        { name: "Laptop", categoryId: 1 },
        { name: "Smartphone", categoryId: 1 },
        { name: "T-Shirt", categoryId: 2 },
      ],
      [
        { productId: 1, quantity: 50 },
        { productId: 1, quantity: 60 },
        { productId: 2, quantity: 30 },
        { productId: 3, quantity: 120 },
      ],
    );

    const result = await datasourceConnection
      .getRepository(Category)
      .createQueryBuilder("category")
      .innerJoin(Product, "product", "product.categoryId = category.id")
      .innerJoin(Sale2, "sale", "sale.productId = product.id")
      .select("category.name", "categoryName")
      .addSelect("product.name", "productName")
      .addSelect("SUM(sale.quantity)", "totalSold")
      .groupBy("category.id, product.id")
      .having("SUM(sale.quantity) > :minQuantity", { minQuantity: 100 })
      .orderBy("categoryName", "ASC")
      .addOrderBy("totalSold", "DESC")
      .getRawMany();

    expect(result).toEqual([
      { categoryName: "Clothing", productName: "T-Shirt", totalSold: 120 },
      { categoryName: "Electronics", productName: "Laptop", totalSold: 110 },
    ]);
  });

  test("should exclude categories below threshold", async () => {
    await seedData(
      [{ name: "Books" }],
      [{ name: "Novel", categoryId: 1 }],
      [{ productId: 1, quantity: 99 }],
    );

    const result = await datasourceConnection
      .getRepository(Category)
      .createQueryBuilder("category")
      .innerJoin(Product, "product", "product.categoryId = category.id")
      .innerJoin(Sale2, "sale", "sale.productId = product.id")
      .select("category.name", "categoryName")
      .addSelect("product.name", "productName")
      .addSelect("SUM(sale.quantity)", "totalSold")
      .groupBy("category.id, product.id")
      .having("SUM(sale.quantity) > :minQuantity", { minQuantity: 100 })
      .orderBy("categoryName", "ASC")
      .addOrderBy("totalSold", "DESC")
      .getRawMany();

    expect(result).toEqual([]);
  });

  test("should aggregate sales across multiple entries", async () => {
    await seedData(
      [{ name: "Toys" }],
      [{ name: "Lego Set", categoryId: 1 }],
      [
        { productId: 1, quantity: 50 },
        { productId: 1, quantity: 51 }, // Total 101
      ],
    );

    const result = await datasourceConnection
      .getRepository(Category)
      .createQueryBuilder("category")
      .innerJoin(Product, "product", "product.categoryId = category.id")
      .innerJoin(Sale2, "sale", "sale.productId = product.id")
      .select("category.name", "categoryName")
      .addSelect("product.name", "productName")
      .addSelect("SUM(sale.quantity)", "totalSold")
      .groupBy("category.id, product.id")
      .having("SUM(sale.quantity) > :minQuantity", { minQuantity: 100 })
      .orderBy("categoryName", "ASC")
      .addOrderBy("totalSold", "DESC")
      .getRawMany();

    expect(result).toEqual([
      { categoryName: "Toys", productName: "Lego Set", totalSold: 101 },
    ]);
  });

  test("should handle decimal quantities", async () => {
    await seedData(
      [{ name: "Groceries" }],
      [{ name: "Rice", categoryId: 1 }],
      [
        { productId: 1, quantity: 99.5 },
        { productId: 1, quantity: 1.5 }, // Total 101
      ],
    );

    const result = await datasourceConnection
      .getRepository(Category)
      .createQueryBuilder("category")
      .innerJoin(Product, "product", "product.categoryId = category.id")
      .innerJoin(Sale2, "sale", "sale.productId = product.id")
      .select("category.name", "categoryName")
      .addSelect("product.name", "productName")
      .addSelect("SUM(sale.quantity)", "totalSold")
      .groupBy("category.id, product.id")
      .having("SUM(sale.quantity) > :minQuantity", { minQuantity: 100 })
      .orderBy("categoryName", "ASC")
      .addOrderBy("totalSold", "DESC")
      .getRawMany();

    expect(parseFloat(result[0].totalSold)).toBeCloseTo(101);
  });

  test("should maintain sorting order", async () => {
    await seedData(
      [{ name: "Category B" }, { name: "Category A" }],
      [
        { name: "Product 2", categoryId: 1 },
        { name: "Product 1", categoryId: 2 },
      ],
      [
        { productId: 1, quantity: 150 },
        { productId: 2, quantity: 200 },
      ],
    );

    const result = await datasourceConnection
      .getRepository(Category)
      .createQueryBuilder("category")
      .innerJoin(Product, "product", "product.categoryId = category.id")
      .innerJoin(Sale2, "sale", "sale.productId = product.id")
      .select("category.name", "categoryName")
      .addSelect("product.name", "productName")
      .addSelect("SUM(sale.quantity)", "totalSold")
      .groupBy("category.id, product.id")
      .having("SUM(sale.quantity) > :minQuantity", { minQuantity: 100 })
      .orderBy("categoryName", "ASC")
      .addOrderBy("totalSold", "DESC")
      .getRawMany();

    expect(result).toEqual([
      { categoryName: "Category A", productName: "Product 1", totalSold: 200 },
      { categoryName: "Category B", productName: "Product 2", totalSold: 150 },
    ]);
  });
});
