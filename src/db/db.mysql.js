const mysql = require("mysql2");
const {
  MYSQL_DATABASE,
  MYSQL_PASSWORD,
  MYSQL_HOST,
  MYSQL_USER,
} = require("../config");

// MySQL database connection configuration
const conn = mysql.createPool({
  connectionLimit: 10,
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
});

// Connect to the MySQL server
conn.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database successfully");

  // Create Authors table
  const createAuthorsTableQuery = `
    CREATE TABLE Authors (
      author_id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255)
    )
  `;

  // Create Books table
  const createBooksTableQuery = `
    CREATE TABLE Books (
      book_id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255),
      author_id VARCHAR(36),
      price DECIMAL(10, 2),
      quantity_available INT,
      FOREIGN KEY (author_id) REFERENCES Authors(author_id)
    )
  `;

  // Create Customers table
  const createCustomersTableQuery = `
    CREATE TABLE Customers (
      customer_id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      address VARCHAR(255)
    )
  `;

  // Create Orders table
  const createOrdersTableQuery = `
    CREATE TABLE Orders (
      order_id VARCHAR(36) PRIMARY KEY,
      customer_id VARCHAR(36),
      order_date DATE,
      FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
    )
  `;

  // Create OrderDetails table
  const createOrderDetailsTableQuery = `
    CREATE TABLE OrderDetails (
      order_id VARCHAR(36),
      book_id VARCHAR(36),
      quantity INT,
      PRIMARY KEY (order_id, book_id),
      FOREIGN KEY (order_id) REFERENCES Orders(order_id),
      FOREIGN KEY (book_id) REFERENCES Books(book_id)
    )
  `;

  // Execute queries
  connection.query(createAuthorsTableQuery, (err) => {
    if (err) {
      console.error("Error creating Authors table:", err);
    } else {
      console.log("Authors table created successfully");
    }
  });

  connection.query(createBooksTableQuery, (err) => {
    if (err) {
      console.error("Error creating Books table:", err);
    } else {
      console.log("Books table created successfully");
    }
  });

  connection.query(createCustomersTableQuery, (err) => {
    if (err) {
      console.error("Error creating Customers table:", err);
    } else {
      console.log("Customers table created successfully");
    }
  });

  connection.query(createOrdersTableQuery, (err) => {
    if (err) {
      console.error("Error creating Orders table:", err);
    } else {
      console.log("Orders table created successfully");
    }
  });

  connection.query(createOrderDetailsTableQuery, (err) => {
    if (err) {
      console.error("Error creating OrderDetails table:", err);
    } else {
      console.log("OrderDetails table created successfully");
    }
    // Release the connection after executing all queries
    connection.release();
  });
});

module.exports = conn;
