"use strict";

const Sequelize = require("sequelize");
const sequelize = new Sequelize("sqlite:memory:");

const initModels = require("./init-models");
const models = initModels(sequelize);

module.exports = { sequelize, models };
