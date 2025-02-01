
-- DATA DEFINITION SECTION

/* disable foreign key constraints*/
PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS demo;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS sales2;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS users;

/* enable foreign key constraints*/
PRAGMA foreign_keys = ON;

CREATE TABLE `sales` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`product` VARCHAR(255) CHECK(LENGTH(product) <= 255) COLLATE NOCASE,
    `quantity` INTEGER,
    `price` DECIMAL(10, 2)
);

CREATE TABLE `customers` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`name` VARCHAR(255) CHECK(LENGTH(name) <= 255) COLLATE NOCASE,
	`country` VARCHAR(255) CHECK(LENGTH(country) <= 255) COLLATE NOCASE
);

CREATE TABLE `orders` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
  	`customer_id` INTEGER,
  	`total` DECIMAL(10,2)
);

CREATE TABLE `employees` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
  	`salary` DECIMAL(10,2),
  	`name` VARCHAR(255) CHECK(LENGTH(name) <= 255) COLLATE NOCASE
);

CREATE TABLE `categories` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
  	`name` VARCHAR(255) CHECK(LENGTH(name) <= 255) COLLATE NOCASE
);

CREATE TABLE `products` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
  	`name` VARCHAR(255) CHECK(LENGTH(name) <= 255) COLLATE NOCASE,
  	`category_id` INTEGER NOT NULL,
  	FOREIGN KEY (category_id) REFERENCES categories(id)
);

/* Sales for 2.5 Consulta com JOIN e Filtragem */
CREATE TABLE `sales2` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
  	`quantity` INTEGER,
  	`product_id` INTEGER NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE `transactions` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
  	`account_id` INTEGER,
  	`transaction_date` DATE,
  	`amount` DECIMAL(10,2)	
);

CREATE TABLE `users` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`email` VARCHAR(255) CHECK(LENGTH(email) <= 255) COLLATE NOCASE,
	`name` VARCHAR(255) CHECK(LENGTH(name) <= 255) COLLATE NOCASE
);

--Creates an index for product column on sales table
CREATE INDEX idx_product ON sales (product);

--Creates an index for email column on users table
CREATE INDEX idx_email ON users(email);

--Creates an index for category_id column on products table
CREATE INDEX idx_products_category ON products(category_id);

--Creates an index for product_id column on sales table
CREATE INDEX idx_sales_product ON sales(product_id);

--Create a coumpound index with account_id and transaction id columns of transactions table
CREATE INDEX idx_transactions_account_date ON transactions(account_id, transaction_date);

-- SEED DATA SECTION 

-- 2.1 Consulta com Agregação
INSERT INTO sales (id, product, quantity, price) VALUES
(1, 'Notebook', 5, 2500.00),
(2, 'Smartphone', 10, 1300.50),
(3, 'Headset', 20, 150.00),
(4, 'Mouse', 15, 65.75),
(5, 'Smartphone', 3, 1300.50),
(6, 'Notebook', 2, 2500.00),
(7, 'Teclado Mecânico', 8, 200.00),
(8, 'Cadeira Gamer', 2, 1100.00);

-- 2.2 Identificar Registros Duplicados
INSERT INTO users (id, email, name) VALUES
(1, 'john.doe@example.com', 'John Doe'),
(2, 'jane.smith@example.com', 'Jane Smith'),
(3, 'john.doe@example.com', 'Johnathan Doe'),
(4, 'kate.brown@example.com', 'Kate Brown'),
(5, 'michael@example.com', 'Michael Johnson'),
(6, 'jane.smith@example.com', 'Janet Smith');

-- 2.3 Atualizar Dados Condicionalmente
INSERT INTO employees (id, name, salary) VALUES
(1, 'Alice', 4000.00),
(2, 'Bob', 5000.00),
(3, 'Charlie', 6000.00),
(4, 'David', 4500.00),
(5, 'Ellen', 4900.00);

-- 2.4 Consulta com JOIN Simples

INSERT INTO customers (id, name, country) VALUES
(1, 'Alice', 'Brazil'),
(2, 'Bob', 'USA'),
(3, 'Carlos', 'Argentina'),
(4, 'Diana', 'Canada');

INSERT INTO orders (id, customer_id, total) VALUES
(1, 1, 150.00),
(2, 1, 200.00),
(3, 2, 300.00),
(4, 4, 500.00),
(5, 4, 100.00);

-- 2.5 Consulta com JOIN e Filtragem

INSERT INTO categories (id, name) VALUES
(1, 'Eletrônicos'),
(2, 'Vestuário'),
(3, 'Acessórios');

INSERT INTO products (id, name, category_id) VALUES
(1, 'Notebook', 1),
(2, 'Smartphone', 1),
(3, 'Fone de Ouvido', 1),
(4, 'Camiseta', 2),
(5, 'Calça', 2),
(6, 'Cinto', 3);

INSERT INTO sales2 (id, product_id, quantity) VALUES
(1, 1, 20),   -- Notebook
(2, 1, 15),   -- Notebook
(3, 2, 200),  -- Smartphone
(4, 3, 10),   -- Fone de Ouvido
(5, 4, 80),   -- Camiseta
(6, 4, 40),   -- Camiseta
(7, 5, 30),   -- Calça
(8, 6, 10);   -- Cinto

-- 2.6 Criação e Consulta de uma VIEW

INSERT INTO transactions (id, account_id, transaction_date, amount) VALUES
(1,  1, '2024-01-05',  2000.00),
(2,  1, '2024-01-15',  8000.00),   -- Soma em Janeiro para account_id=1 -> 10.000
(3,  1, '2024-02-10',  3000.00),
(4,  2, '2024-01-20',  12000.00),  -- Soma em Janeiro para account_id=2 -> 12.000
(5,  2, '2024-02-25',  2000.00),
(6,  3, '2024-01-10',  4000.00),
(7,  3, '2024-01-25',  2000.00),   -- Soma em Janeiro para account_id=3 -> 6.000 (não atinge 10.000)
(8,  3, '2024-03-05',  1500.00);

-- 2.1 Consulta com Agregação

/*
	Considering that the Sales table will change with a low frequency during software lifecycle (DELETE AND UPDATES)
	AND that this table also will have tons of data, because usualy there are lots of products, variations of the same product etc...
    that implies on lots of sales to be inserted
    Probably a good decision for this one is create an index for the product column on sales table
    
    CREATE INDEX idx_product ON sales (product);
    
    this will increase the avg query speed.
    
    Without an index, SQLite scans the entire table (O(n) complexity)
	
    With an index, SQLite can quickly find matching rows (O(log n)) using a B-tree search
*/

SELECT 
    product,
    SUM(quantity * price) AS total_revenue
FROM sales
GROUP BY product
ORDER BY total_revenue DESC;

-- 2.2 Identificar Registros Duplicados

/*
	This query can be optimized with an index on the email collumn of the users table:
    
    CREATE INDEX idx_email ON users(email);
    
    Without an index, SQLite scans the entire table (O(n) complexity)
	
    With an index, SQLite can quickly find matching rows (O(log n)) using a B-tree search
    
    The above described operation will increase the efficiency of the GROUP BY AN COUNT operations
    in counterpart will reduce the WRITE operations speed, but this is not a problem in this scenario because the users table will
    be much more readed than writed.
*/

SELECT 
    email,
    COUNT(email) AS occurrences
FROM users
GROUP BY email
HAVING occurrences > 1;

-- 2.3 Atualizar Dados Condicionalmente

-- How it is a update operation that will change a sensitive data `salary` 
-- IS Important to create a restore point

-- ***IMPORTANT*** If you run this SQL multiple times you should enable this command before ATTACH DATABASE: DETACH DATABASE BACKUP

DETACH DATABASE BACKUP;
    
-- Creating a database to store our backup ***You could add the date of execution to backup database name***
ATTACH DATABASE 'update_salary_(DATE).db' AS backup;

DROP TABLE IF EXISTS backup.pre_update;

-- Creating a table with all current emplemployees salaries, before the update
CREATE TABLE backup.pre_update AS SELECT * FROM employees;

-- We could restore at any time with 

-- IS IMPORTANT PREVENT OTHER WRITE OPERATIONS
-- during they execution, so we will use a IMMEDIATE TRANSACTION

BEGIN IMMEDIATE TRANSACTION;

UPDATE employees
SET salary = CAST(salary * 1.1 AS INTEGER)
WHERE rowid IN ( -- rowid is a implicity column in every sqlite table 
  
  	-- We can improve the speed of this query creating an INDEX for salary column on employee table
  	-- after do this, the INSERT speed will be reduced in trade of increase the QUERY speed, but in my pov it's not a problem because the
  	-- usually during a software lifecycle an `employees` table will be more QUERIED than WRITED.
  
  	-- Without an index, SQLite scans the entire table (O(n) complexity)
	
    -- With an index, SQLite can quickly find matching rows (O(log n)) using a B-tree search
 
    SELECT rowid 
    FROM employees
    WHERE salary < 5000
    ORDER BY rowid
    LIMIT 1000 -- This is designed to work with large tables too. The plan is process in batches of max 1000 rows
  	-- We can execute this in a loop until it affects 0 rows.
);
COMMIT;

-- 2.4 Consulta com JOIN Simples

/*
	This query will responde well to the case of list all costumers that has order 
    with their respective total value of all orders they have.
    
    For optimization, we can consider create an INDEX for the `customer_id` column on `orders` table. It will improves our
    query performance. OBS: We dont need to create an INDEX for the `id` column on `orders` table because it already is a INDEX as it is a PRIMARY KEY
	
    By doing this INDEX creation, we can work on O(log(n)) time complexity wich is faster than previou (without the INDEX) O(n) complexity.
*/

SELECT 
    c.name, 
    SUM(o.total) AS total_expense
FROM customers AS c
INNER JOIN orders AS o ON c.id = o.customer_id
GROUP BY c.id
ORDER BY total_expense DESC;

-- 2.5 Consulta com JOIN e Filtragem

SELECT 
    c.name AS nome_categoria,
    p.name AS nome_produto,
    SUM(s.quantity) AS total_vendido
FROM categories c
INNER JOIN products p ON p.category_id = c.id
INNER JOIN sales2 s ON s.product_id = p.id
GROUP BY c.id, p.id
HAVING SUM(s.quantity) > 100
ORDER BY total_vendido DESC;

-- As the previous challenges with could use INDEXE's on columns enroled in the query (`category_id` and `product_id`) to change
-- the time complexity from linear to logarithmic wich will increase que query speed

-- 2.6 Criação e Consulta de uma VIEW

CREATE VIEW monthly_summary AS
SELECT 
    account_id,
    strftime('%Y-%m', transaction_date) AS month,
    SUM(amount) AS total_amount
FROM transactions
GROUP BY account_id, month;

SELECT *
FROM monthly_summary
WHERE total_amount > 10000;

-- Just remember that we could create an index for this one too, but i dont know if it will be a recommended decision to be taken
-- because probablly the `transactions` table will be WRITED with a high frequency, and INDEXE's reduces the speed of this type of operation.
-- I let the INDEX created in DATA-DEFINITION section, but just for demonstrational purpouses.
