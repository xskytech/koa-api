module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    type: DataTypes.SMALLINT,
    value: DataTypes.STRING
  }, {});

  Token.associate = (models) => {
    Token.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };

  return Token;
};
