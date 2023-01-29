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
  const DeliveryChallan = sequelize.define("delivery_challan", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: Sequelize.STRING,
    },
    doctor_name: {
      type: Sequelize.STRING,
    },
    invoice_id: {
      type: Sequelize.INTEGER,
      references: { model: "tax_invoices", key: "value" },
      onDelete: "CASCADE",
    },
    client_id: {
      type: Sequelize.INTEGER,
      references: { model: "clients", key: "value" },
      onDelete: "CASCADE",
    },
  });
  return DeliveryChallan;
};
