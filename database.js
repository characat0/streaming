const { Sequelize } = require("sequelize");
const { database, ENV } = require("./config");
const options = ENV === "DEVELOPMENT" ? database["DEVELOPMENT"] : database["PRODUCTION"];
console.log(ENV, options);
const sequelize = new Sequelize(options);

module.exports = sequelize;