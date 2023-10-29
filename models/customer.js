"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class customer extends Model {
    static associate(models) {
    }
  }
  customer.init({
      nama: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      telepon: DataTypes.INTEGER,
    }, {
      sequelize,
      modelName: 'customer',
    }
  );
  return customer;
};
