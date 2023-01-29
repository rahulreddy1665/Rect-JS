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
  const User = sequelize.define("users", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.BIGINT,
    },
    alternate_num: {
      type: Sequelize.BIGINT,
    },
    role: {
      type: Sequelize.STRING,
    },
    gst_id: {
      type: Sequelize.STRING,
    },
    dlone: {
      type: Sequelize.STRING,
    },
    dltwo: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
  });
  return User;
};
