"use strict";

const Sequelize = require("sequelize");
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false
});

const initModels = require("./init-models");
const models = initModels(sequelize);

module.exports = { sequelize, models };
