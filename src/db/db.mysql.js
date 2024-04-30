const mysql = require("mysql2/promise");
const {
  MYSQL_DATABASE,
  MYSQL_PASSWORD,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PORT,
} = require("../config");

const pool = mysql.createPool({
  connectionLimit: 10,
  password: MYSQL_PASSWORD,
  user: MYSQL_USER,
  database: MYSQL_DATABASE,
  host: MYSQL_HOST,
  port: MYSQL_PORT,
});

const initPool = mysql.createPool({
  connectionLimit: 10,
  password: MYSQL_PASSWORD,
  user: MYSQL_USER,
  host: MYSQL_HOST,
  port: MYSQL_PORT,
});

async function dropDb() {
  try {
    const connection = await initPool.getConnection();
    await connection.query(`DROP DATABASE IF EXISTS ${MYSQL_DATABASE}`);
    console.log("Database dropped successfully.");
    connection.release();
  } catch (error) {
    console.error("Error occurred while dropping the database:", error);
  }
}

async function createDatabase() {
  try {
    const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};`;
    const connection = await initPool.getConnection();
    await connection.query(createDbQuery);
    console.log(`Database "${MYSQL_DATABASE}" created`);
    connection.release();
  } catch (error) {
    console.error("Error occurred while creating database:", error);
  }
}

async function createTables() {
  try {
    const connection = await pool.getConnection();
    const createAuthorsTableQuery = `
    CREATE TABLE Authors (
      author_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255)
    )
    `;
    await connection.query(createAuthorsTableQuery);

    const createBooksTableQuery = `
    CREATE TABLE Books (
      book_id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      author_id INT,
      price DECIMAL(10, 2),
      quantity_available INT,
      FOREIGN KEY (author_id) REFERENCES Authors(author_id)
    )
    `;
    await connection.query(createBooksTableQuery);

    const createCustomersTableQuery = `
    CREATE TABLE Customers (
      customer_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      address VARCHAR(255)
    )
    `;
    await connection.query(createCustomersTableQuery);

    const createOrdersTableQuery = `
    CREATE TABLE Orders (
      order_id INT AUTO_INCREMENT PRIMARY KEY,
      customer_id INT,
      order_date DATE,
      FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
    )
    `;
    await connection.query(createOrdersTableQuery);

    const createOrderDetailsTableQuery = `
    CREATE TABLE OrderDetails (
      order_id INT,
      book_id INT,
      quantity INT,
      PRIMARY KEY (order_id, book_id),
      FOREIGN KEY (order_id) REFERENCES Orders(order_id),
      FOREIGN KEY (book_id) REFERENCES Books(book_id)
    )
    `;
    await connection.query(createOrderDetailsTableQuery);

    console.log("All tables created successfully");
    connection.release();
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

async function releaseConnection() {
  try {
    await pool.end();
    console.log("Connection pool closed successfully.");
  } catch (error) {
    console.error("Error occurred while releasing connection:", error);
  }
}

async function createManyRows() {
  try {
    const connection = await pool.getConnection();

    const insertAuthorQuery = `
      INSERT INTO Authors (name) VALUES
      ('Author 1'),
      ('Author 2'),
      ('Author 3'),
      ('Author 4'),
      ('Author 5'),
      ('Author 6'),
      ('Author 7'),
      ('Author 8'),
      ('Author 9'),
      ('Author 10')
    `;

    const insertBookQuery = `
      INSERT INTO Books (title, price, quantity_available) VALUES
      ('Book 1', 10.99, 100),
      ('Book 2', 12.99, 80),
      ('Book 3', 15.99, 120),
      ('Book 4', 9.99, 90),
      ('Book 5', 11.99, 110),
      ('Book 6', 14.99, 70),
      ('Book 7', 8.99, 150),
      ('Book 8', 16.99, 60),
      ('Book 9', 13.99, 130),
      ('Book 10', 17.99, 50)
    `;

    const insertCustomerQuery = `
      INSERT INTO Customers (name, email, address) VALUES
      ('Customer 1', 'customer1@example.com', '123 Main St'),
      ('Customer 2', 'customer2@example.com', '456 Elm St'),
      ('Customer 3', 'customer3@example.com', '789 Oak St'),
      ('Customer 4', 'customer4@example.com', '101 Pine St'),
      ('Customer 5', 'customer5@example.com', '222 Maple St'),
      ('Customer 6', 'customer6@example.com', '333 Cedar St'),
      ('Customer 7', 'customer7@example.com', '444 Walnut St'),
      ('Customer 8', 'customer8@example.com', '555 Birch St'),
      ('Customer 9', 'customer9@example.com', '666 Pine St'),
      ('Customer 10', 'customer10@example.com', '777 Oak St')
    `;

    const insertOrdersQuery = `
      INSERT INTO Orders (customer_id, order_date) VALUES
      (1, '2024-04-29 01:00:00'),
      (2, '2024-04-29 02:00:00'),
      (3, '2024-04-29 02:00:00'),
      (4, '2024-04-29 03:00:00'),
      (5, '2024-04-29 04:00:00'),
      (6, '2024-04-29 05:00:00'),
      (7, '2024-04-29 06:00:00'),
      (8, '2024-04-29 07:00:00'),
      (9, '2024-04-29 08:00:00'),
      (10, '2024-04-29 09:00:00')
    `;

    const insertOrderDetailsQuery = `
      INSERT INTO OrderDetails (order_id, book_id, quantity) VALUES
      (1, 1, 5),
      (2, 2, 3),
      (3, 3, 7),
      (4, 4, 2),
      (5, 5, 4),
      (6, 6, 6),
      (7, 7, 8),
      (8, 8, 1),
      (9, 9, 9),
      (10, 10, 10)
    `;

    const promises = [
      connection.query(insertAuthorQuery),
      connection.query(insertBookQuery),
      connection.query(insertCustomerQuery),
      connection.query(insertOrdersQuery),
      connection.query(insertOrderDetailsQuery),
    ];

    await Promise.all(promises);
    console.log("All rows inserted successfully");

  } catch (error) {
    console.error("Error occurred while creating many rows:", error);
    throw error;
  }
}

const beforeStart = async () => {
  await dropDb();
  await createDatabase();
  await createTables();
  await createManyRows();
};

const getPool = () => {
  return pool;
};

module.exports = {
  getPool,
  createDatabase,
  dropDb,
  createTables,
  createManyRows,
  releaseConnection,
  beforeStart,
};
