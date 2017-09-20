const faker = require("faker");
module.exports = () => {
  // ----------------------------------------
  // Create Items
  // ----------------------------------------
  console.log("Creating items");
  var items = [];

  items.push(
    new Item({
      name: faker.commerce.product(),
      price: faker.random.number({ min: 40, max: 500 }),
      image: faker.image.image()
    })
  );
  items.push(
    new Item({
      name: faker.commerce.product(),
      price: faker.random.number({ min: 40, max: 500 }),
      image: faker.image.image()
    })
  );
  items.push(
    new Item({
      name: faker.commerce.product(),
      price: faker.random.number({ min: 40, max: 500 }),
      image: faker.image.image()
    })
  );
  items.push(
    new Item({
      name: faker.commerce.product(),
      price: faker.random.number({ min: 40, max: 500 }),
      image: faker.image.image()
    })
  );
  items.push(
    new Item({
      name: faker.commerce.product(),
      price: faker.random.number({ min: 40, max: 500 }),
      image: faker.image.image()
    })
  );
  items.push(
    new Item({
      name: faker.commerce.product(),
      price: faker.random.number({ min: 40, max: 500 }),
      image: faker.image.image()
    })
  );
  items.push(
    new Item({
      name: faker.commerce.product(),
      price: faker.random.number({ min: 40, max: 500 }),
      image: faker.image.image()
    })
  );
  items.push(
    new Item({
      name: faker.commerce.product(),
      price: faker.random.number({ min: 40, max: 500 }),
      image: faker.image.image()
    })
  );

  //Seed other models...

  // ----------------------------------------
  // Finish
  // ----------------------------------------
  console.log("Saving...");
  var promises = [];
  [
    items
    //other models...
  ].forEach(collection => {
    collection.forEach(model => {
      promises.push(model.save());
    });
  });
  return Promise.all(promises);
};
