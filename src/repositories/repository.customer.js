const conn = require("../db/db.mysql");

async function findAll() {
  try {
    const promiseConnection = conn.promise();
    const selectQuery = "SELECT * FROM Customers";
    const [rows] = await promiseConnection.query(selectQuery);
    return rows;
  } catch (error) {
    console.error("Error occurred while finding all customers:", error);
    throw error;
  }
}
module.exports = {
  findAll
};
