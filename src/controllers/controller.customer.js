const { StatusCodes } = require("http-status-codes");
const customerService = require("../services/service.customer");

async function findAll(req, res) {
  try {
    const customers = await customerService.findAll();
    res.status(StatusCodes.OK).json(customers);
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
