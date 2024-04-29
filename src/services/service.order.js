const orderRepository = require("../repositories/repository.order");

async function findAll() {
  const users = await orderRepository.findAll();
  return users;
}

module.exports = {
  findAll
};
