const { getPool } = require("../db/db.mysql");

async function pagination(page, limit) {
  try {
    const offset = (page - 1) * limit;
    const selectQuery = `
    SELECT Orders.order_id,
    Customers.name AS customer_name, Customers.email, Customers.address,
    Books.title AS book_title, Books.price, Books.quantity_available,
    Authors.name AS author_name,
    OrderDetails.quantity
    FROM Orders
    INNER JOIN Customers ON Orders.customer_id = Customers.customer_id
    INNER JOIN OrderDetails ON Orders.order_id = OrderDetails.order_id
    INNER JOIN Books ON OrderDetails.book_id = Books.book_id
    INNER JOIN Authors ON Books.author_id = Authors.author_id
    LIMIT ${limit} OFFSET ${offset}
`;

    const connection = await getPool().getConnection();
    const [rows] = await connection.query(selectQuery); // Destructure rows directly to avoid wrapping in an array

    const countQuery = `SELECT COUNT(*) AS count FROM Orders`;

    const [countRows] = await connection.query(countQuery);
    const totalCount = countRows[0].count;
    const totalPages = Math.ceil(totalCount / limit);

    const result = {
      totalPages: totalPages,
      data: rows,
    };
    connection.release();
    return result;
  } catch (error) {
    console.error("Error occurred while finding customers:", error);
    throw error;
  }
}

async function search(searchTerm, page, limit) {
  try {
    const offset = (page - 1) * limit;
    let selectQuery = `
    SELECT Orders.order_id,
    Customers.name AS customer_name, Customers.email, Customers.address,
    Books.title AS book_title, Books.price, Books.quantity_available,
    Authors.name AS author_name,
    OrderDetails.quantity
    FROM Orders
    INNER JOIN Customers ON Orders.customer_id = Customers.customer_id
    INNER JOIN OrderDetails ON Orders.order_id = OrderDetails.order_id
    INNER JOIN Books ON OrderDetails.book_id = Books.book_id
    INNER JOIN Authors ON Books.author_id = Authors.author_id
    `;

    // Add search condition if search term is provided
    if (searchTerm) {
      selectQuery += `
        WHERE 
          Customers.name LIKE '%${searchTerm}%' OR
          Customers.email LIKE '%${searchTerm}%' OR
          Customers.address LIKE '%${searchTerm}%' OR
          Books.title LIKE '%${searchTerm}%' OR
          Authors.name LIKE '%${searchTerm}%' OR
          Books.price LIKE '%${searchTerm}%'
        
      `;
    }

    // Add pagination limit and offset
    selectQuery += ` LIMIT ${limit} OFFSET ${offset}`;

    const connection = await getPool().getConnection();
    const [rows] = await connection.query(selectQuery);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) AS count
      FROM Orders
      INNER JOIN Customers ON Orders.customer_id = Customers.customer_id
      INNER JOIN OrderDetails ON Orders.order_id = OrderDetails.order_id
      INNER JOIN Books ON OrderDetails.book_id = Books.book_id
      INNER JOIN Authors ON Books.author_id = Authors.author_id
      ${
        searchTerm
          ? `WHERE Customers.name LIKE '%${searchTerm}%' OR Customers.email LIKE '%${searchTerm}%' OR Customers.address LIKE '%${searchTerm}%' OR Books.title LIKE '%${searchTerm}%' OR Authors.name LIKE '%${searchTerm}%'`
          : ""
      }
    `;
    const [countRows] = await connection.query(countQuery);
    const totalCount = countRows[0].count;
    const totalPages = Math.ceil(totalCount / limit);

    const result = {
      totalPages: totalPages,
      data: rows,
    };
    connection.release();
    return result;
  } catch (error) {
    console.error("Error occurred while searching and paginating:", error);
    throw error;
  }
}

module.exports = {
  pagination,
  search,
};
