const seeder = require('mongooseeder');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const models = require('../models');
const User = models.User;
const faker = require('faker');
const mongodbUrl = 'mongodb://localhost/project_ponz_development';

let depth = 0;
async function createNestedPonverts(user) {
	let rand = Math.floor(1 + Math.random() * 5);
	for (let a = 0; a < rand; a++) {
		let child = await User.create({
			username: faker.internet.userName(),
			password: 'foo',
			parent: user,
			ponverts: []
		});
		process.stdout.write('.');
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
			process.stdout.write('Creating parent...');
			let parent = await User.create({
				username: faker.internet.userName(),
				password: 'foo',
				ponverts: []
			});
			console.log('Done.');
			process.stdout.write('Creating children');
			await createNestedPonverts(parent);
			console.log('Done.');
		}
	}
});
