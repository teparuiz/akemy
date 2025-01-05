"use strict";

require("dotenv").config();

const Sequelize = require("sequelize");
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH || '/tmp/database.sqlite',
});

const initModels = require("./init-models");
const models = initModels(sequelize);

module.exports = { sequelize, models };
