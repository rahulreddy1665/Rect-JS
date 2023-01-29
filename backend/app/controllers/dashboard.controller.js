/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const db = require("../models");
const TaxInvoice = db.taxInvoice; //main db
const TaxInvoiceTransaction = db.taxInvoiceTransaction;
const Op = db.Sequelize.Op;
const Client = db.client;
const Product = db.product;
const ProformaInvoice = db.proformaInvoice; //main db

exports.reportTwoDate = async (req, res) => {
  try {
    var firstDay = new Date(req.body.date1); //get first day of the year
    var lastDay = new Date(req.body.date2); //get last date date of the year
    console.log(firstDay, lastDay, req.body.customer);
    if (
      typeof req.body.customer != "undefined" &&
      req.body.customer != null &&
      req.body.customer != ""
    ) {
      if (
        req.body.date1 == "" &&
        req.body.date2 == "" &&
        req.body.customer == ""
      ) {
        const month_data = await TaxInvoice.findAll({
          order: [["value", "DESC"]],
          include: [
            {
              model: TaxInvoiceTransaction,
              required: false,
            },
          ],
        });
        Promise.all([month_data])
          .then((data) => {
            res.send({ data });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error retrieving data ",
            });
          });
      } else if (
        req.body.date1 == "" &&
        req.body.date2 == "" &&
        req.body.customer != ""
      ) {
        const month_data = await TaxInvoice.findAll({
          order: [["value", "DESC"]],
          where: {
            client_id: req.body.customer,
          },
          include: [
            {
              model: TaxInvoiceTransaction,
              required: false,
            },
          ],
        });
        Promise.all([month_data])
          .then((data) => {
            res.send({ data });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error retrieving data ",
            });
          });
      } else if (
        req.body.date1 !== "" &&
        req.body.date2 == "" &&
        req.body.customer != ""
      ) {
        const month_data = await TaxInvoice.findAll({
          order: [["value", "DESC"]],
          where: {
            invoice_date: {
              [Op.gt]: new Date(firstDay).setHours(0, 0, 0, 0),
              [Op.lt]: new Date(firstDay).setHours(23, 59, 59, 59),
            },
            client_id: req.body.customer,
          },
          include: [
            {
              model: TaxInvoiceTransaction,
              required: false,
            },
          ],
        });
        Promise.all([month_data])
          .then((data) => {
            res.send({ data });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error retrieving data ",
            });
          });
      } else if (
        req.body.date1 !== "" &&
        req.body.date2 !== "" &&
        req.body.customer != ""
      ) {
        const month_data = await TaxInvoice.findAll({
          where: {
            invoice_date: {
              [Op.gt]: firstDay,
              [Op.lt]: lastDay,
            },
            client_id: req.body.customer,
          },
          order: [["value", "DESC"]],
          include: [
            {
              model: TaxInvoiceTransaction,
              required: false,
            },
          ],
        });
        Promise.all([month_data])
          .then((data) => {
            res.send({ data });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error retrieving data ",
            });
          });
      }
    } else {
      if (req.body.date1 == "" && req.body.date2 == "") {
        const month_data = await TaxInvoice.findAll({
          order: [["value", "DESC"]],
          include: [
            {
              model: TaxInvoiceTransaction,
              required: false,
            },
          ],
        });
        Promise.all([month_data])
          .then((data) => {
            res.send({ data });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error retrieving data ",
            });
          });
      } else if (req.body.date1 != "" && req.body.date2 == "") {
        console.log("hi2");
        const month_data = await TaxInvoice.findAll({
          where: {
            invoice_date: {
              [Op.gt]: new Date(firstDay).setHours(0, 0, 0, 0),
            },
          },
          order: [["value", "DESC"]],
          include: [
            {
              model: TaxInvoiceTransaction,
              required: false,
            },
          ],
        });
        Promise.all([month_data])
          .then((data) => {
            res.send({ data });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error retrieving data ",
            });
          });
      } else {
        const month_data = await TaxInvoice.findAll({
          where: {
            invoice_date: {
              [Op.gt]: firstDay,
              [Op.lt]: lastDay,
            },
          },
          order: [["value", "DESC"]],
          include: [
            {
              model: TaxInvoiceTransaction,
              required: false,
            },
          ],
        });
        Promise.all([month_data])
          .then((data) => {
            res.send({ data });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error retrieving data ",
            });
          });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: "Failed to perform request",
      detail: error,
    });
  }
};

exports.dashboard = async (req, res) => {
  try {
    //get curent date year
    var date = new Date(); //preset date
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1); //get first day of the year
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); //get last date date of the year

    // Get all the invoice of this years
    const total_sale = await TaxInvoice.count();

    const total_client = await Client.count();

    const total_product = await Product.count();

    const total_proforma = await ProformaInvoice.count();

    const invoice_list = await TaxInvoice.findAll({
      where: db.sequelize.where(
        db.sequelize.fn("YEAR", db.sequelize.col("invoice_date")),
        date.getFullYear().toString()
      ),
      order: [["invoice_date", "ASC"]],
    });

    Promise.all([
      total_sale,
      total_client,
      total_product,
      total_proforma,
      invoice_list,
    ])
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: "Failed to perform request",
          detail: err,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Failed to perform request",
      detail: error,
    });
  }
};
