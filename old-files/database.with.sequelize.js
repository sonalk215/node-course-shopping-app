const {Sequelize} = require("sequelize");
const sequelize = new Sequelize('max-node-course', 'root', 'rootuser', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;