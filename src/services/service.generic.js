const genericRepository = require("../repositories/repository.generic");

async function query(query) {
  const users = await genericRepository.query(query);
  return users;
}

module.exports = {
  query
};
