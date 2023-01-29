module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define("account", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    gstin: {
      type: Sequelize.STRING,
    },
    dl1: {
      type: Sequelize.STRING,
    },
    dl2: {
      type: Sequelize.STRING,
    },
    company: {
      type: Sequelize.STRING,
    },
  });
  return Account;
};
