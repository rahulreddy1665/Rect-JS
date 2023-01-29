module.exports = (sequelize, Sequelize) => {
  const TaxInvoice = sequelize.define("tax_invoice", {
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    invoice_date: {
      type: Sequelize.DATE,
    },
    invoice_num: {
      type: Sequelize.BIGINT,
    },
    client_id: {
      type: Sequelize.STRING,
    },
    client_name: {
      type: Sequelize.STRING,
    },
    client_gst: {
      type: Sequelize.STRING,
    },
    reference: {
      type: Sequelize.STRING(1000),
    },
    patient_name: {
      type: Sequelize.STRING(1000),
    },
    ip_num: {
      type: Sequelize.STRING(1000),
    },
    dl_num: {
      type: Sequelize.STRING(1000),
    },
    dc_num: {
      type: Sequelize.STRING(1000),
    },
    po_number: {
      type: Sequelize.STRING,
    },
    total_amount: {
      type: Sequelize.STRING,
    },
    due_amount: {
      type: Sequelize.STRING,
    },
    discount_percent: {
      type: Sequelize.STRING,
    },
    discount_amount: {
      type: Sequelize.STRING,
    },
    sub_totalamt: {
      type: Sequelize.STRING,
    },
    final_amount: {
      type: Sequelize.STRING,
    },
    gst_amount: {
      type: Sequelize.STRING,
    },
    email_status: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
  });
  return TaxInvoice;
};
