module.exports = (sequelize, Sequelize) => {
  const TaxInvoicePayment = sequelize.define("tax_invoice_payment", {
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
    payment_method: {
      type: Sequelize.STRING,
    },
    payment_status: {
      type: Sequelize.STRING,
    },
    total_amount: {
      type: Sequelize.STRING,
    },
    amount_paid: {
      type: Sequelize.STRING,
    },
    due_amount: {
      type: Sequelize.STRING,
    },
  });
  return TaxInvoicePayment;
};
