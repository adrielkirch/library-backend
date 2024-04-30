const { StatusCodes } = require("http-status-codes");
const orderService = require("../services/service.order");

async function pagination(req, res) {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 3;

    const orders = await orderService.pagination(page, limit);
    res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

async function search(req, res) {
  try {
    const value = req.query.value || "";
    const page = req.query.page || 1;
    const limit = req.query.limit || 3;


    const orders = await orderService.search(value,page,limit);
    res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

module.exports = {
  pagination,
  search
};
