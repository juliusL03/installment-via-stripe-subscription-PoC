'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      // id: DataTypes.DataTypes.INTEGER,
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        }
      },
      stripeCustomerID: {
        type: DataTypes.STRING,
        field: 'stripe_customer_id',
        allowNull: false
      },
      stripeToken: {
        type: DataTypes.STRING,
        field: 'stripe_token',
        allowNull: true
      },
      card: {
        type: DataTypes.JSON,
        field: 'card',
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'User',
      //freezeTableName: true,
    }
  );
  return User;
};
