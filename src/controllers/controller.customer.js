const { StatusCodes } = require("http-status-codes");
const customerService = require("../services/service.customer");

async function pagination(req, res) {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 3;

    const customers = await customerService.pagination(page, limit );
    res.status(StatusCodes.OK).json(customers);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

module.exports = {
  pagination,
};
