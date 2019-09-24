module.exports = (sequelize, DataTypes) => {
  const UserSocial = sequelize.define('UserSocial', {
    socialId: DataTypes.STRING,
    type: DataTypes.SMALLINT,
    url: DataTypes.STRING
  }, {});

  UserSocial.associate = (models) => {
    UserSocial.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };

  return UserSocial;
};
