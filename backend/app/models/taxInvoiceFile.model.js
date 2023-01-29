module.exports = (sequelize, Sequelize) => {
  const TaxInvoiceFile = sequelize.define("tax_invoice_file", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    invoice_id: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: { model: "clients", key: "value" },
      onDelete: "CASCADE",
    },
    path: {
      type: Sequelize.STRING,
    },
    file_name: {
      type: Sequelize.STRING,
    },
  });
  return TaxInvoiceFile;
};
