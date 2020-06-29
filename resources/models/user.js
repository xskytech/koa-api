/* eslint-disable require-jsdoc, func-names */

const { randomBytes } = require('crypto');
const { promisify } = require('util');

const { omit } = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ErrorMessages = require('../../constants/errors').VALIDATION;
const Statuses = require('../../constants/statuses');
const config = require('../../config');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: ErrorMessages.REQUIRED },
        notEmpty: { msg: ErrorMessages.REQUIRED },
        len: { args: [4, 32], msg: ErrorMessages.LENGTH },
      },
      set(value) {
        this.setDataValue('fullName', value.trim());
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: ErrorMessages.REQUIRED },
        notEmpty: { msg: ErrorMessages.REQUIRED },
        isEmail: { msg: ErrorMessages.INVALID_EMAIL },
      },
      unique: {
        msg: ErrorMessages.UNIQUE,
      },
      set(value) {
        this.setDataValue('email', value.trim().toLowerCase());
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: ErrorMessages.REQUIRED },
        len: { args: [6], msg: ErrorMessages.LENGTH },
      },
    },
    picture: DataTypes.STRING,
    accessTokenSalt: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    sex: DataTypes.BOOLEAN,
    dob: DataTypes.DATE,
    status: {
      type: DataTypes.SMALLINT,
      defaultValue: Statuses.PENDING,
    },
  }, {
    hooks: {
      beforeSave: async (model) => {
        if (model.isNewRecord || model.changed('password')) {
          if (model.password) {
            const password = await bcrypt.hash(model.password, 10);
            model.setDataValue('password', password);
          }

          model.setDataValue('accessTokenSalt', (await promisify(randomBytes)(32)).toString('hex'));
          await model.updateRefreshToken();
        }
      },
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Token, { as: 'tokens', foreignKey: 'userId' });
    User.hasMany(models.UserSocial, { as: 'socials', foreignKey: 'userId' });
  };

  User.loadScopes = (models) => {
    User.addScope('defaultScope', {
      include: [{
        model: models.UserSocial,
        as: 'socials',
      }],
    });
  };

  User.prototype.toJSON = function () {
    const model = this.get();
    const hiddenFields = ['password', 'accessTokenSalt', 'refreshToken'];

    return omit(model, hiddenFields);
  };

  User.prototype.authenticate = function () {
    return {
      type: 'JWT',
      accessToken: jwt.sign(
        {
          id: this.id,
          accessTokenSalt: this.accessTokenSalt,
          refreshToken: this.refreshToken,
        },
        config.jwtSecret,
        {
          expiresIn: '4m',
        }
      ),
    };
  };

  User.prototype.updateRefreshToken = async function () {
    this.setDataValue('refreshToken', (await promisify(randomBytes)(32)).toString('hex'));
  };

  User.prototype.comparePassword = function (password) {
    return this.password && bcrypt.compare(password, this.password);
  };

  return User;
};
