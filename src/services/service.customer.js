const customerRepository = require("../repositories/repository.customer");

async function pagination(page, limit) {
  const users = await customerRepository.pagination(page, limit);
  return users;
}


module.exports = {
  pagination
};
