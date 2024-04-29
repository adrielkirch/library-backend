const customerRepository = require("../repositories/repository.customer");

async function findAll() {
  const users = await customerRepository.findAll();
  return users;
}


module.exports = {
  findAll
};
