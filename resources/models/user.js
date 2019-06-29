/* eslint-disable require-jsdoc */

const bcrypt = require('bcrypt');

const ErrorMessages = require('../../constants/errors').VALIDATION;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: ErrorMessages.REQUIRED },
        notEmpty: { msg: ErrorMessages.REQUIRED },
        len: { args: [4, 32], msg: ErrorMessages.LENGTH }
      },
      set(value) {
        this.setDataValue('fullName', value.trim());
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: ErrorMessages.REQUIRED },
        notEmpty: { msg: ErrorMessages.REQUIRED },
        isEmail: { msg: ErrorMessages.INVALID_EMAIL }
      },
      unique: {
        msg: ErrorMessages.UNIQUE
      },
      set(value) {
        this.setDataValue('email', value.trim().toLowerCase());
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: ErrorMessages.REQUIRED },
        notEmpty: { msg: ErrorMessages.REQUIRED },
        len: { args: [6], msg: ErrorMessages.LENGTH }
      }
    },
    sex: DataTypes.BOOLEAN,
    dob: DataTypes.DATE
  }, {
    hooks: {
      beforeSave: async (model) => {
        if (model.isNewRecord || model.changed('password')) {
          if (model.password) {
            const password = await bcrypt.hash(model.password, 10);
            model.setDataValue('password', password);
          }
        }
      }
    }
  });

  return User;
};
