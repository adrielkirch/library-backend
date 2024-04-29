const { StatusCodes } = require("http-status-codes");
const orderService = require("../services/service.order");

async function findAll(req, res) {
  try {
    const orders = await orderService.findAll();
    res.status(StatusCodes.CREATED).json(orders);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

module.exports = {
  findAll,
};
