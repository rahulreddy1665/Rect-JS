/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const config = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");
// const winston = require("winston");

// var fs = require('fs')

// const logStream = fs.createWriteStream('./sql.log', { 'flags': 'a' });

/*
  For getting the db information from config table as required from above config
 */
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,

  // logging: msg => logStream.write(msg),

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import user model
db.user = require("../models/user.model.js")(sequelize, Sequelize);

db.client = require("../models/client.model")(sequelize, Sequelize);
db.group = require("../models/group.model")(sequelize, Sequelize);
db.hsnTax = require("../models/hsnTax.model")(sequelize, Sequelize);

db.product = require("../models/product.model")(sequelize, Sequelize);
db.product.belongsTo(db.group, {
  foreignKey: "group_id",
});
db.product.belongsTo(db.hsnTax, {
  foreignKey: "hsn_id",
});

db.taxInvoice = require("../models/taxInvoice.model")(sequelize, Sequelize);

db.taxInvoiceTransaction = require("../models/taxInvoiceTransaction.model")(
  sequelize,
  Sequelize
);
db.taxInvoice.hasMany(db.taxInvoiceTransaction, {
  foreignKey: "invoice_id",
});
db.taxInvoiceTransaction.belongsTo(db.taxInvoice, {
  foreignKey: "invoice_id",
});

db.taxInvoicePayment = require("../models/taxInvoicePayment.model")(
  sequelize,
  Sequelize
);
db.taxInvoice.hasMany(db.taxInvoicePayment, {
  foreignKey: "invoice_id",
});
db.taxInvoicePayment.belongsTo(db.taxInvoice, {
  foreignKey: "invoice_id",
});

db.saveTaxInvoice = require("../models/saveTaxInvoice.model")(
  sequelize,
  Sequelize
);

db.saveTaxinvoiceTransaction =
  require("../models/saveTaxinvoiceTransaction.model")(sequelize, Sequelize);
db.saveTaxInvoice.hasMany(db.saveTaxinvoiceTransaction, {
  foreignKey: "invoice_id",
});
db.saveTaxinvoiceTransaction.belongsTo(db.saveTaxInvoice, {
  foreignKey: "invoice_id",
});

db.proformaInvoice = require("../models/proformaInvoice.model")(
  sequelize,
  Sequelize
);

db.proformaInvoiceTransaction =
  require("../models/proformaInvoiceTransaction.model")(sequelize, Sequelize);
db.proformaInvoice.hasMany(db.proformaInvoiceTransaction, {
  foreignKey: "invoice_id",
});
db.proformaInvoiceTransaction.belongsTo(db.proformaInvoice, {
  foreignKey: "invoice_id",
});

db.account = require("../models/account.model")(sequelize, Sequelize);

db.deliveryChallan = require("../models/deliveryChallan.model")(
  sequelize,
  Sequelize
);
db.deliveryChallan.belongsTo(db.taxInvoice, {
  foreignKey: "invoice_id",
});
db.deliveryChallan.belongsTo(db.client, {
  foreignKey: "client_id",
});
const queryInterface = sequelize.getQueryInterface();
// queryInterface.addColumn("clients", "credit_limit", {
//   type: Sequelize.BIGINT,
// });
// queryInterface.dropAllTables();
// queryInterface.addColumn("products", "lot_number", {
//   type: Sequelize.STRING,
// });
// queryInterface.addColumn("tax_invoice_transactions", "lot_number", {
//   type: Sequelize.STRING,
// });
// queryInterface.addColumn("tax_invoices", "po_number", {
//   type: Sequelize.STRING,
// });
// queryInterface.addColumn("save_tax_invoices", "po_number", {
//   type: Sequelize.STRING,
// });
// queryInterface.addColumn("tax_invoice_transactions", "discount", {
//   type: Sequelize.STRING,
// });
module.exports = db;
