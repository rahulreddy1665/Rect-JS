/**
 * For Main controller start
 * Import all requires db and models and etc
 */

const db = require("../models");
const TaxInvoice = db.proformaInvoice; //main db
const TaxInvoiceTransaction = db.proformaInvoiceTransaction;
const TaxInvoicePayment = db.taxInvoicePayment;
const User = db.user; //for eager loading depencies

// Find one product by id
exports.findById = (req, res) => {
  try {
    const id = req.params.id;
    TaxInvoice.findByPk(id, {
      include: [
        {
          model: TaxInvoiceTransaction,
          required: false,
        },
      ],
    })
      .then((data) => {
        //For send the success to res
        res.send(data);
      })
      .catch((err) => {
        //for send the error to res
        res.status(500).send({
          message: "Error retrieving product with id=" + id + "",
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

//Find All product
exports.findAll = (req, res) => {
  try {
    //for get all users with the user decencies
    TaxInvoice.findAll()
      .then((data) => {
        //send the success res to
        res.status(200).send({
          data: data,
        });
      })
      .catch((err) => {
        //send the error res to
        res.status(500).send({
          message: "Error retrieving all product",
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

// For create product
exports.add = async (req, res) => {
  try {
    const last = await TaxInvoice.findAll({
      limit: 1,
      order: [["invoice_date", "DESC"]],
    });
    var invoice = "";
    //check for last invoice null
    if (last.length > 0) {
      invoice = Number(last[0].invoice_num) + 1; //add id with last invoice
    } else {
      invoice = 2051; //or just add 1
    }

    //add the variable values to req data
    const detail = {
      invoice_num: invoice,
      invoice_date: req.body.date,
      client_name: req.body.customer,
      client_gst: req.body.customerGST,
      client_id: req.body.customer_id,
      reference: req.body.reference,
      patient_name: req.body.patient_name,
      ip_num: req.body.ip_num,
      dl_num: req.body.dl_num,
      dc_num: req.body.dc_num,
      total_amount: req.body.dc_num,
      total_amount: req.body.total_amount,
      due_amount: req.body.due_amount,
      discount_amount: req.body.discount_amount,
      sub_totalamt: req.body.sub_totalamt,
    };

    //create new product
    const invoice_create = await TaxInvoice.create(detail);

    var list = req.body.list;
    for (i = 0; i < list.length; i++) {
      const details2 = {
        invoice_id: invoice_create.value,
        invoice_date: req.body.date,
        product_name: list[i].product.label,
        hsn: list[i].product.hsn_code,
        sku: list[i].product.sku_code,
        mrp_display: list[i].product.price,
        lot_number: list[i].product.lot_number,
        quantity: list[i].qty,
        price: list[i].price,
        total_amount: list[i].total,
        type: list[i].type,
      };
      await TaxInvoiceTransaction.create(details2);
    }

    //after create new product get all the product data with decencies
    const data = await TaxInvoice.findByPk(invoice_create.value);
    //for promise req get
    Promise.all([data])
      .then((data) => {
        res.send({ data });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving data ",
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Failed to perform request",
      detail: error,
    });
  }
};

// Delete proforma invoice
exports.delete = (req, res) => {
  try {
    TaxInvoice.destroy({
      where: { value: req.params.id },
    })
      .then((data) => {
        //For send the success to res
        res.send(data);
      })
      .catch((err) => {
        //for send the error to res
        res.status(500).send({
          message: "Error retrieving product with ",
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
