
const pool = require("../db/db.mysql");

async function queryAny(selectQuery) {
  try {
    const connection = await pool.getConnection();
    const rows =   await connection.query(selectQuery);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error occurred while performing query", error);
    throw error;
  }
}
module.exports = {
  queryAny,
};
