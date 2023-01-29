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
  const Group = sequelize.define("groups", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: Sequelize.STRING,
    },
  });
  return Group;
};
