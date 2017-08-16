const seeder = require('mongooseeder');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const models = require('../models');
const User = models.User;
const faker = require('faker');
const mongodbUrl = 'mongodb://localhost/project_ponz_development';

let depth = 0;
async function createNestedPonverts(user) {
	let rand = Math.floor(Math.random() * 5);
	for (let a = 0; a < rand; a++) {
		console.log(depth, a);
		let child = await User.create({
			username: faker.internet.userName(),
			password: 'foo',
			parent: user,
			ponverts: []
		});
		console.log('Creating child');
		user.addPonvert(child);
		user.save();
		if (depth < 3) {
			depth++;
			await createNestedPonverts(child);
			depth--;
		}
	}
}

seeder.seed({
	mongodbUrl: mongodbUrl,
	models: models,
	clean: true,
	mongoose: mongoose,
	seeds: async () => {
		for (let i = 0; i < 3; i++) {
			let parent = await User.create({
				username: faker.internet.userName(),
				password: 'foo',
				ponverts: []
			});
			await createNestedPonverts(parent);
			console.log(parent);
		}
	}
});
