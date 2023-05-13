const { faker } = require("@faker-js/faker");
const { generateProduct } = require("./generate-product.js");

faker.locale = "es";

const generateUsers = () => {
  let numOfProd = parseInt(faker.random.numeric(1, { bannedDigits: ["0"] }));
  let products = [];
  for (let index = 0; index < numOfProd; index++) {
    products.push(generateProduct());
  }

  return {
    _id: faker.database.mongodbObjectId(),
    email: faker.internet.email(),
    name: faker.name.firstName(),
    lastName: faker.name.lastName(),
    role: faker.helpers.arrayElement(['admin', 'user']),
  };
};

module.exports = { generateUsers };