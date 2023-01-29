/**
 * Application Name: Royal Volunteers Front End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

module.exports = (sequelize, Sequelize) => {
  const HSNTax = sequelize.define("hsn_tax", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: Sequelize.STRING,
    },
    tax: {
      type: Sequelize.STRING,
    },
  });
  return HSNTax;
};
