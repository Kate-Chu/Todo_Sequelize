"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("Todos", "UserId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: "Users",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("Todos", "UserId");
  },
};
