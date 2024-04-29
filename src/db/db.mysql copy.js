const mysql = require("mysql");
const {
  MYSQL_DATABASE,
  MYSQL_PASSWORD,
  MYSQL_HOST,
  MYSQL_USER,
} = require("../config");

// MySQL database connection configuration

let connection; // Singleton connection variable

async function getConnectionAsync() {
  if (!connection) {
    connection = await createConnection();
  }
  return connection;
}

async function createConnection() {
  const pool = mysql.createPool({
    connectionLimit: 10,
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
  });

  try {
    const conn = await pool.getConnection();
    return conn;
  } catch (error) {
    throw error;
  }
}

function getFirstConnectionAsync() {
  const pool = mysql.createPool({
    connectionLimit: 10,
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
  });

  return new Promise((resolve, reject) => {
    pool.getConnection(async (err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
}

async function createDatabase() {
  let connection;
  try {
    connection = await getFirstConnectionAsync();

    const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};`;
    await connection.query(createDbQuery);

    console.log(`Database "${MYSQL_DATABASE}" created or already exists.`);
  } catch (error) {
    console.error("Error occurred while creating database:", error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Connect to the MySQL server
(async () => {
  try {
    await createDatabase();
    const connection = await getConnectionAsync();

    const createAuthorsTableQuery = `
      CREATE TABLE Authors (
        author_id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255)
      )
    `;

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

    const createCustomersTableQuery = `
      CREATE TABLE Customers (
        customer_id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        address VARCHAR(255)
      )
    `;

    const createOrdersTableQuery = `
      CREATE TABLE Orders (
        order_id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36),
        order_date DATE,
        FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
      )
    `;

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

    await executeQuery(connection, createAuthorsTableQuery);
    await executeQuery(connection, createBooksTableQuery);
    await executeQuery(connection, createCustomersTableQuery);
    await executeQuery(connection, createOrdersTableQuery);
    await executeQuery(connection, createOrderDetailsTableQuery);

    await createManyRows(connection);
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();

async function executeQuery(connection, query) {
  console.log(query);
  try {
    const [rows, fields] = await connection.execute(query);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function createManyRows(connection) {
  try {
    const numRows = await checkNumAuthorRows(connection);
    console.log("Num rows ->," + numRows);
    if (numRows > 0) {
      return;
    }
    const insertAuthorQuery = `
    INSERT INTO Authors (author_id, name) VALUES
    ('1faba27c-5e34-4892-a93d-0e781b2060c0', 'Author 1'),
    ('883d1fb4-3cf6-4d55-b76c-faa588e1eb28', 'Author 2'),
    ('99d86a23-ad8b-4718-a6f8-da6654d38b19', 'Author 3'),
    ('3e6164ec-e441-4dfb-b7bf-24ae608bde58', 'Author 4'),
    ('79868c9c-8f4a-43a7-8050-1084c39607e7', 'Author 5'),
    ('7e8131f1-71c6-4c94-aedf-b05b2b847043', 'Author 6'),
    ('6a9dbf9b-e230-4e39-8a5b-d162f1646a13', 'Author 7'),
    ('8072faa5-c081-4eb2-b37b-64c12a86ea9e', 'Author 8'),
    ('5b636281-1c7b-44a9-a121-0cab05b619f6', 'Author 9'),
    ('24c52c20-6910-4a93-9046-415648bd132a', 'Author 10');
    `;

    const insertBookQuery = `
    INSERT INTO Books (book_id, title, author_id, price, quantity_available) VALUES
    ('407409ac-fea6-49c0-84cb-84a650462f5a', '1faba27c-5e34-4892-a93d-0e781b2060c0', 'author1', 10.99, 100),
    ('f46f13b5-bca1-4ee7-b814-c1b852645409', '883d1fb4-3cf6-4d55-b76c-faa588e1eb28', 'author2', 12.99, 80),
    ('2bbcf629-e235-46d5-8605-ab4bd9a27ef9', '99d86a23-ad8b-4718-a6f8-da6654d38b19', 'author3', 15.99, 120),
    ('31054f94-ff31-49de-84dc-ac92379d4982', '3e6164ec-e441-4dfb-b7bf-24ae608bde58', 'author4', 9.99, 90),
    ('c58bee20-9e7e-4f63-b461-e879c2292292', '79868c9c-8f4a-43a7-8050-1084c39607e7', 'author5', 11.99, 110),
    ('afa71cd4-ddda-43eb-aac5-2d05ecc4758a', '7e8131f1-71c6-4c94-aedf-b05b2b847043', 'author6', 14.99, 70),
    ('310bfbea-3715-42cd-924e-6b78e645d245', '6a9dbf9b-e230-4e39-8a5b-d162f1646a13', 'author7', 8.99, 150),
    ('a969a6d6-5b2b-402b-ba97-90e1176a1a42', '8072faa5-c081-4eb2-b37b-64c12a86ea9e', 'author8', 16.99, 60),
    ('2095a13e-a5f6-4b99-bb95-68c8a728ea09', '5b636281-1c7b-44a9-a121-0cab05b619f6', 'author9', 13.99, 130),
    ('2fc321ff-fadf-44e2-979c-d17cd68e8fa9', '24c52c20-6910-4a93-9046-415648bd132a',  'author10', 17.99, 50);
    `;

    const insertCustomerQuery = `
    INSERT INTO Customers (customer_id, name, email, address) VALUES
    ('065b20eb-22d7-4302-8f09-dc66e455c29a', 'Customer 1', 'customer1@example.com', '123 Main St'),
    ('460c4077-7d49-4737-8884-f58c13929ac7', 'Customer 2', 'customer2@example.com', '456 Elm St'),
    ('e23d29b1-ce66-4dc6-9169-b2144a62e68e', 'Customer 3', 'customer3@example.com', '789 Oak St'),
    ('a7af99db-beee-478c-a678-f43d9380cb9d', 'Customer 4', 'customer4@example.com', '101 Pine St'),
    ('ac5188e3-7a61-4776-a5a9-b0a8fe3c0f88', 'Customer 5', 'customer5@example.com', '222 Maple St'),
    ('e00c02c4-4d12-4912-ac18-e9fe90a5b247', 'Customer 6', 'customer6@example.com', '333 Cedar St'),
    ('f30088cf-0edc-43fc-90ff-e7ed7c954b20', 'Customer 7', 'customer7@example.com', '444 Walnut St'),
    ('b40b1136-206e-4b6f-b1cc-3b524923ee89', 'Customer 8', 'customer8@example.com', '555 Birch St'),
    ('6dd06000-e368-4ac1-9d60-39a94a18b4a4', 'Customer 9', 'customer9@example.com', '666 Pine St'),
    ('194cf2e1-ec1a-41c6-912d-b389cedd2200', 'Customer 10', 'customer10@example.com', '777 Oak St');
    `;

    const insertOrdersQuery = `
    INSERT INTO Orders (order_id, customer_id, order_date) VALUES
    ('c5c937e6-8e05-4954-bb60-de3b1d36defd', 'f8c6156a-7f8c-42fd-ba1b-7fdf7a747fa7', 5),
    ('e8637dbf-ceee-4870-8a0a-4d099b0644ae', '801c19a8-50b3-4528-b535-7eab24d68914', 3),
    ('d2246c3d-8c4f-4cfc-8b1f-14319fb47b94', 'd810fe01-b797-4a79-9cdd-5ec4030d73fb', 7),
    ('8951ff95-937e-434d-bce8-2391fb63c20b', 'e61ba40a-9f7f-4999-8809-9a6bf017af9b', 2),
    ('e75a6212-9d57-4b07-97b1-6fa4b9424aee', 'b05b318b-a427-493a-84e3-dc469ca25729', 4),
    ('e83eef12-4d6d-450c-a0da-fad588cdb846', '918d067e-1586-444d-b2e4-9ef5b5f28a03', 6),
    ('e163fa8e-90d4-473e-a332-393a6fad62e7', '43141ac7-78b0-4181-98d4-93166d64f45b', 8),
    ('e5c5f54e-c03b-492f-b351-566d96021da5', '45524c09-4cd1-42b7-becc-8500f57827c3', 1),
    ('62232717-3f1c-4ae7-87ad-8cb66157def2', '9cfc5f81-dde4-4336-baad-f2817001cbbe', 9),
    ('e1b57d23-b858-41dd-adc6-7cd3c2531e08', '46d0641c-a0c5-4b21-ae22-e8195cd50a1b', 10);
    `;

    const insertQuery = `
    INSERT INTO OrderDetails (order_id, book_id, quantity) VALUES
    ('c5c937e6-8e05-4954-bb60-de3b1d36defd', '407409ac-fea6-49c0-84cb-84a650462f5a', 5),
    ('e8637dbf-ceee-4870-8a0a-4d099b0644ae', 'f46f13b5-bca1-4ee7-b814-c1b852645409', 3),
    ('d2246c3d-8c4f-4cfc-8b1f-14319fb47b94', '2bbcf629-e235-46d5-8605-ab4bd9a27ef9', 7),
    ('8951ff95-937e-434d-bce8-2391fb63c20b', '31054f94-ff31-49de-84dc-ac92379d4982', 2),
    ('e75a6212-9d57-4b07-97b1-6fa4b9424aee', 'c58bee20-9e7e-4f63-b461-e879c2292292', 4),
    ('e83eef12-4d6d-450c-a0da-fad588cdb846', 'afa71cd4-ddda-43eb-aac5-2d05ecc4758a', 6),
    ('e163fa8e-90d4-473e-a332-393a6fad62e7', '310bfbea-3715-42cd-924e-6b78e645d245', 8),
    ('e5c5f54e-c03b-492f-b351-566d96021da5', 'a969a6d6-5b2b-402b-ba97-90e1176a1a42', 1),
    ('62232717-3f1c-4ae7-87ad-8cb66157def2', '2095a13e-a5f6-4b99-bb95-68c8a728ea09', 9),
    ('e1b57d23-b858-41dd-adc6-7cd3c2531e08', '2fc321ff-fadf-44e2-979c-d17cd68e8fa9',  10);
    `;

    const promises = [
      executeQuery(connection, insertAuthorQuery),
      executeQuery(connection, insertBookQuery),
      executeQuery(connection, insertCustomerQuery),
      executeQuery(connection, insertOrdersQuery),
      executeQuery(connection, insertQuery),
    ];

    await Promise.all(promises);
    console.log("All rows inserted successfully");
  } catch (error) {
    console.error("Error occurred while creating many rows:", error);
    throw error;
  }
}

async function checkNumAuthorRows(connection) {
  try {
    const promiseConnection = connection.promise();
    const countQuery = "SELECT COUNT(*) AS num_rows FROM Authors";
    const [rows] = await promiseConnection.query(countQuery);
    const numRows = rows[0].num_rows;

    return numRows;
  } catch (error) {
    console.error(
      "Error occurred while counting rows in Authors table:",
      error
    );
    throw error;
  }
}

module.exports = getConnectionAsync;
