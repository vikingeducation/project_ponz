const MULTIPLIER = 1;

module.exports = () => {
  // ----------------------------------------
  // Create Parent Users
  // ----------------------------------------
  console.log("Creating Parent Users...");
  let users = [];
  for (let i = 0; i < MULTIPLIER * 5; i++) {
    let user = new User({
      email: `foobar${i}@gmail.com`,
      password: "123",
      score: 0
    });
    users.push(user);
  }

  // ----------------------------------------
  // Create Child Users
  // ----------------------------------------
  console.log("Creating Child Users...");
  let childUsers = [];
  for (let i = 0; i < MULTIPLIER * 15; i++) {
    let parent = users[i % users.length];
    let user = new User({
      email: `foobar${i + 15 * MULTIPLIER}@gmail.com`,
      password: "123",
      parent: parent,
      score: 0
    });
    parent.children.push(user);
    childUsers.push(user);
  }

  // ----------------------------------------
  // Create Grandchild Users
  // ----------------------------------------
  console.log("Creating Grandchild Users...");
  let grandChildUsers = [];
  for (let i = 0; i < MULTIPLIER * 45; i++) {
    let parent = childUsers[i % childUsers.length];
    let user = new User({
      email: `foobar${i + 45 * MULTIPLIER}@gmail.com`,
      password: "123",
      parent: parent,
      score: 0
    });
    parent.children.push(user);
    grandChildUsers.push(user);
  }

  // ----------------------------------------
  // Create Great Grandchild Users
  // ----------------------------------------
  console.log("Creating Great Grandchild Users...");
  let greatGrandChildUsers = [];
  for (let i = 0; i < MULTIPLIER * 135; i++) {
    let parent = grandChildUsers[i % grandChildUsers.length];
    let user = new User({
      email: `foobar${i + 135 * MULTIPLIER}@gmail.com`,
      password: "123",
      parent: parent,
      score: 0
    });
    parent.children.push(user);
    greatGrandChildUsers.push(user);
  }

  // ----------------------------------------
  // Finish
  // ----------------------------------------
  console.log("Saving...");
  let promises = [];
  [
    users,
    childUsers,
    grandChildUsers,
    greatGrandChildUsers
  ].forEach(collection => {
    collection.forEach(model => {
      promises.push(model.save());
    });
  });
  return Promise.all(promises);
};
