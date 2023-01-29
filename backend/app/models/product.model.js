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
  const Product = sequelize.define("products", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: Sequelize.STRING,
    },
    sku_code: {
      type: Sequelize.STRING,
    },
    group_id: {
      type: Sequelize.INTEGER,
      references: { model: "groups", key: "value" },
      onDelete: "CASCADE",
    },
    hsn_id: {
      type: Sequelize.INTEGER,
      references: { model: "hsn_taxes", key: "value" },
      onDelete: "CASCADE",
    },
    quantity: {
      type: Sequelize.BIGINT,
    },
    price: {
      type: Sequelize.BIGINT,
    },
    lot_number: {
      type: Sequelize.STRING,
    },
  });
  return Product;
};
