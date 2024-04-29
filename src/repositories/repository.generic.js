const pool = require("../db/db.mysql");

async function query(selectQuery) {
  try {
    console.log("query: ", selectQuery);

    const rows = await pool.query(selectQuery);

    return rows;
  } catch (error) {
    console.error("Error occurred while performing query", error);
    throw error;
  }
}
module.exports = {
  query,
};
