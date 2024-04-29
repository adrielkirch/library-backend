

const pool = require("../db/db.mysql");

async function findAll() {
  try {
    const selectQuery = "SELECT * FROM Customers";
    const rows = await pool.query(selectQuery);
    return rows;
  } catch (error) {
    console.error("Error occurred while finding all customers:", error);
    throw error;
  }
}


module.exports = {
  findAll
};
