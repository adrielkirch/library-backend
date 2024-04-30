const orderRepository = require("../repositories/repository.order");

async function pagination(page, limit) {
  const users = await orderRepository.pagination(page, limit);
  return users;
}

module.exports = {
  pagination
};
