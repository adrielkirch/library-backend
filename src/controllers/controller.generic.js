const { StatusCodes } = require("http-status-codes");
const genericService = require("../services/service.generic");

async function query(req, res) {
  try {
    const { query } = req.body;
    const orders = await genericService.query(query);
    res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

module.exports = {
  query,
};
