module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      accessTokenSalt: {
        allowNull: false,
        type: Sequelize.STRING
      },
      refreshToken: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sex: {
        type: Sequelize.BOOLEAN
      },
      dob: {
        type: Sequelize.DATE
      },
      status: {
        allowNull: false,
        type: Sequelize.SMALLINT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('Users', { unique: true, fields: ['email'] });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  }
};
