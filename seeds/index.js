const mongoose = require('mongoose');
const mongooseeder = require('mongooseeder');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/mongo')[env];

const envUrl = process.env[config.use_env_variable];
const localUrl = `mongodb://${ config.host }/${ config.database }`;
const mongodbUrl =  envUrl ? envUrl : localUrl;

const models = require('../models');
const { User } = models;

const faker = require('faker');
const randomstring = require("randomstring");

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  models: models,
  clean: true,
  mongoose: mongoose,
  seeds: () => {

    const users = [];
    for (let i = 0; i < 1; i++) {
      let user = new User ({
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        password: 'secret',
        referralCode: randomstring.generate(7)
      });
      users.push(user);
    }

    var promises = [];

    [users].forEach(models => {
      for (let model of models) {
        promises.push(model.save());
      }
    });

    return Promise.all(promises);
  }
});
