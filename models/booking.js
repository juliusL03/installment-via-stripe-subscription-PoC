'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  booking.init({
    installmentStatus: {
        type: DataTypes.JSON,
        field: 'installment_status',
        allowNull: true
    },
    installmentPlan: {
      type: DataTypes.JSON,
      field: 'installment_plan',
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'booking',
  });
  return booking;
};