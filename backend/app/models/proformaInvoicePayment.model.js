module.exports = (sequelize, Sequelize) => {
  const ProformaInvoicePayment = sequelize.define("proforma_invoice_payment", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    invoice_id: {
      type: Sequelize.STRING,
    },
    payment_method: {
      type: Sequelize.STRING,
    },
    payment_status: {
      type: Sequelize.STRING,
    },
    total_amount: {
      type: Sequelize.BIGINT,
    },
    amount_paid: {
      type: Sequelize.BIGINT,
    },
    due_amount: {
      type: Sequelize.BIGINT,
    },
    receivedby: {
      type: Sequelize.BIGINT,
    },
  });
  return ProformaInvoicePayment;
};
