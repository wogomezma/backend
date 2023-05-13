const { faker } = require("@faker-js/faker");



faker.locale = "es";

const generateProduct = () => {

  return {
    name: faker.commerce.productName(),
    code: faker.datatype.number(100),
    price: faker.commerce.price(),
    stock: faker.datatype.number(100),
    thumbnail: faker.image.food(),
    description: faker.commerce.productDescription(),
  };
};

module.exports = { generateProduct };
