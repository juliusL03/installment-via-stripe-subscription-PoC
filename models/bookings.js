'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  bookings.init({
    paymentStatus: {
        type: DataTypes.JSON,
        field: 'payment_status',
        allowNull: true
    },
    transactions: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      field: 'transactions',
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'bookings',
  });
  return bookings;
};