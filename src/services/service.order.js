const orderRepository = require("../repositories/repository.order");

async function pagination(page, limit) {
  const orders = await orderRepository.pagination(page, limit);
  return orders;
}

async function search(value,page, limit) {
  const orders = await orderRepository.search(value,page, limit);
  return orders;
}

module.exports = {
  pagination,
  search
};
