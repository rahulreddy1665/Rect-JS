module.exports = (sequelize, Sequelize) => {
  const TaxInvoiceTransaction = sequelize.define("tax_invoice_transaction", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    invoice_id: {
      type: Sequelize.INTEGER,
      references: { model: "tax_invoices", key: "value" },
      onDelete: "CASCADE",
    },
    invoice_date: {
      type: Sequelize.DATE,
    },
    product_name: {
      type: Sequelize.STRING,
    },
    hsn: {
      type: Sequelize.STRING,
    },
    sku: {
      type: Sequelize.STRING,
    },
    lot_number: {
      type: Sequelize.STRING,
    },
    mrp_display: {
      type: Sequelize.STRING,
    },
    quantity: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.STRING,
    },
    discount: {
      type: Sequelize.STRING,
    },
    total_amount: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
  });
  return TaxInvoiceTransaction;
};
