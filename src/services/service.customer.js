const customerRepository = require("../repositories/repository.customer");

async function pagination(page, limit) {
  const users = await customerRepository.pagination(page, limit);
  return users;
}

async function search(value,page, limit) {
  const users = await customerRepository.search(value, page, limit);
  return users;
}



module.exports = {
  pagination,search
};
