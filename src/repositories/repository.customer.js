const { getPool } = require("../db/db.mysql");

async function pagination(page, limit) {
  try {
    const offset = (page - 1) * limit;
    const selectQuery = `SELECT * FROM Customers LIMIT ${limit} OFFSET ${offset}`;
    const connection = await getPool().getConnection();
    const [rows] = await connection.query(selectQuery); // Destructure rows directly to avoid wrapping in an array

    const countQuery = `SELECT COUNT(*) AS count FROM Customers`;

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
    let selectQuery = `SELECT * FROM Customers`;

    // Add search condition if search term is provided
    if (searchTerm) {
      selectQuery += ` WHERE name LIKE '%${searchTerm}%' OR email LIKE '%${searchTerm}%' OR address LIKE '%${searchTerm}%'`;
    }

    selectQuery += ` LIMIT ${limit} OFFSET ${offset}`;

    const connection = await getPool().getConnection();
    const [rows] = await connection.query(selectQuery);

    const countQuery = `SELECT COUNT(*) AS count FROM Customers ${
      searchTerm
        ? `WHERE name LIKE '%${searchTerm}%' OR email LIKE '%${searchTerm}%' OR address LIKE '%${searchTerm}%'`
        : ""
    }`;
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
    console.error(
      "Error occurred while searching and paginating customers:",
      error
    );
    throw error;
  }
}

module.exports = {
  pagination,
  search,
};
