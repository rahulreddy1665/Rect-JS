module.exports = (sequelize, Sequelize) => {
  const Client = sequelize.define("client", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: Sequelize.STRING,
    },
    email1: {
      type: Sequelize.STRING,
    },
    email2: {
      type: Sequelize.STRING,
    },
    email3: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.STRING,
    },
    alternate: {
      type: Sequelize.STRING,
    },
    gstin: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING(10000),
    },
    credit_limit: {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    },
    state: {
      type: Sequelize.STRING,
    },
  });
  return Client;
};
