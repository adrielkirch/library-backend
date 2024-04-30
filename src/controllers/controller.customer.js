const { StatusCodes } = require("http-status-codes");
const customerService = require("../services/service.customer");
let isSearching = false;

async function pagination(req, res) {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 3;

    const customers = await customerService.pagination(page, limit);
    res.status(StatusCodes.OK).json(customers);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

async function search(req, res) {
  try {

    if (isSearching) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Search in progress" });
    }

    isSearching = true; // Set semaphore to true

    const value = req.query.value || "";
    const page = req.query.page || 1;
    const limit = req.query.limit || 3;

    const customers = await customerService.search(value, page, limit);
    res.status(StatusCodes.OK).json(customers);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  } finally {
    isSearching = false; // Reset semaphore after search is complete or error occurs
  }
}


module.exports = {
  pagination,
  search,
};
