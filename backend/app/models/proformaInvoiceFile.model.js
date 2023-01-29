module.exports = (sequelize, Sequelize) => {
  const ProformaInvoiceFile = sequelize.define("proforma_invoice_file", {
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
      type: Sequelize.STRING,
    },
    path: {
      type: Sequelize.STRING,
    },
    file_name: {
      type: Sequelize.BIGINT,
    },
  });
  return ProformaInvoiceFile;
};
