const conn = require("../db/db.mysql");

async function findAll() {
  try {
    const promiseConnection = conn.promise();
    const selectQuery = "SELECT * FROM Ordes";
    const [rows] = await promiseConnection.query(selectQuery);
    return rows;
  } catch (error) {
    console.error("Error occurred while finding all orders:", error);
    throw error;
  }
}
module.exports = {
  findAll,
};
