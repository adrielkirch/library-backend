const { getPool } = require("../db/db.mysql");

async function queryAny(selectQuery) {
  try {
    const connection = await getPool().getConnection();
    const rows =   await connection.query(selectQuery);
    connection.release();
    return rows[0];
  } catch (error) {
    console.error("Error occurred while performing query", error);
    throw error;
  }
}
module.exports = {
  queryAny,
};
