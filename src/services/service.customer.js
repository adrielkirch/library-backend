const customerRepository = require("../repositories/repository.customer");

async function pagination(page, limit) {
  const customers = await customerRepository.pagination(page, limit);
  return customers;
}

async function search(value,page, limit) {
  if (search === "") {
    const customers = await orderRepository.pagination(page, limit);
    return customers;
  }
  const customers = await customerRepository.search(value, page, limit);
  return customers;
}



module.exports = {
  pagination,search
};
