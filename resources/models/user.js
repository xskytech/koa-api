/* eslint-disable require-jsdoc, func-names */

const { omit } = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ErrorMessages = require('../../constants/errors').VALIDATION;
const config = require('../../config');

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
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    },

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

  User.prototype.toJSON = function () {
    const model = this.get();
    const hiddenFields = ['password', 'createdAt', 'updatedAt'];

    return omit(model, hiddenFields);
  };

  User.prototype.authenticate = function () {
    return {
      type: 'JWT',
      accessToken: jwt.sign(
        {
          id: this.id
        },
        config.jwtSecret,
        {
          expiresIn: '4h'
        }
      )
    };
  };

  User.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
