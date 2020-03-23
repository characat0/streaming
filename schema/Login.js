const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");


class Login extends Model {  }
Login.init({
    id: {
        type: DataTypes.INTEGER({ unsigned: true }),
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    }
},{
    tableName: 'accounts',
    sequelize,
    indexes: [{ unique: false, fields: [{name:'username'}, {name: 'password'}], using: 'HASH' }]
});
module.exports = Login;