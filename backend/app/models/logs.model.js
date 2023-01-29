/**
 * Application Name: Royal Volunteers Front End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

// For creating corporator_user database
//dependencies = none

module.exports = (sequelize, Sequelize) => {
  const Log = sequelize.define("logs", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    txinv_id: {
      type: Sequelize.STRING,
    },
    prominv_id: {
      type: Sequelize.STRING,
    },
    txtrans_id: {
      type: Sequelize.STRING,
    },
    prmtrans_id: {
      type: Sequelize.BIGINT,
    },
    notify: {
      type: Sequelize.BIGINT,
    },
    status: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.STRING,
    },
  });
  return Log;
};
