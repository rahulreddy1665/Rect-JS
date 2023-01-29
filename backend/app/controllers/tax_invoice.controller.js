/**
 * For Main controller start
 * Import all requires db and models and etc
 */

const db = require("../models");
const TaxInvoice = db.taxInvoice; //main db
const TaxInvoiceTransaction = db.taxInvoiceTransaction;
const TaxInvoicePayment = db.taxInvoicePayment;
const DeliveryChallan = db.deliveryChallan;
const Client = db.client; //for eager loading depencies

// Find one tax_invoice by id
exports.findById = (req, res) => {
  try {
    const id = req.params.id;
    TaxInvoice.findByPk(id, {
      order: [["invoice_date", "DESC"]],
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
          message: "Error retrieving tax_invoice with id=" + id + "",
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

//Find All tax_invoice
exports.findAll = (req, res) => {
  try {
    //for get all users with the user decencies
    TaxInvoice.findAll({
      order: [["invoice_date", "DESC"]],
      include: [
        {
          model: TaxInvoiceTransaction,
          required: false,
        },
      ],
    })
      .then((data) => {
        //send the success res to
        res.status(200).send({
          data: data,
        });
      })
      .catch((err) => {
        //send the error res to
        res.status(500).send({
          message: "Error retrieving all tax_invoice",
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

exports.findAll10 = (req, res) => {
  try {
    //for get all users with the user decencies
    TaxInvoice.findAll({
      limit: 10,
      order: [["invoice_date", "DESC"]],
      include: [
        {
          model: TaxInvoiceTransaction,
          required: false,
        },
      ],
    })
      .then((data) => {
        //send the success res to
        res.status(200).send({
          data: data,
        });
      })
      .catch((err) => {
        //send the error res to
        res.status(500).send({
          message: "Error retrieving all tax_invoice",
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
//Find All tax_invoice
exports.findAllPayments = (req, res) => {
  try {
    //for get all users with the user decencies
    TaxInvoicePayment.findAll({
      where: { invoice_id: req.params.id },
    })
      .then((data) => {
        //send the success res to
        res.status(200).send({
          data: data,
        });
      })
      .catch((err) => {
        //send the error res to
        res.status(500).send({
          message: "Error retrieving all tax_invoice",
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

// For create tax_invoice
exports.add = async (req, res) => {
  // console.log(req.body);
  try {
    var check = 1;
    // For check the client credit limit
    if (
      req.body.customer_id != "" &&
      req.body.customer_id != null &&
      typeof req.body.customer_id != "undefined"
    ) {
      const client = await Client.findByPk(req.body.customer_id);
      if (Number(client.credit_limit) > 0) {
        if (Number(client.credit_limit) >= Number(req.body.due_amount)) {
          check = 0;
        }
      }
    }

    if (check == 1) {
      const last = await TaxInvoice.findAll({
        limit: 1,
        order: [["createdAt", "DESC"]],
      });
      var invoice = "";
      //check for last invoice null
      if (last.length > 0) {
        invoice = Number(last[0].invoice_num) + 1; //add id with last invoice
      } else {
        invoice = 1; //or just add 1
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
        po_number: req.body.po_number,
        dc_num: req.body.dc_num,
        total_amount: req.body.dc_num,
        total_amount: req.body.total_amount,
        due_amount: req.body.due_amount,
        discount_amount: req.body.discount_amount,
        sub_totalamt: req.body.sub_totalamt,
        gst_amount: req.body.totalTax,
      };

      //create new invoice data
      const invoice_create = await TaxInvoice.create(detail);

      var list = req.body.list;
      for (i = 0; i < list.length; i++) {
        const details2 = {
          invoice_id: invoice_create.value,
          invoice_date: req.body.date,
          product_name: list[i].product.label,
          hsn: list[i].product.hsn_code,
          sku: list[i].product.sku_code,
          mrp_display: list[i].mrp !== 0 ? list[i].mrp : "-",
          quantity: list[i].qty,
          lot_number: list[i].lot_number,
          discount: list[i].discount,
          price: list[i].price,
          total_amount: list[i].total,
          type: list[i].type,
        };
        await TaxInvoiceTransaction.create(details2);
      }

      // For update credit limit
      // const cls = {
      //   credit_limit: Number(client.credit_limit) - Number(req.body.due_amount),
      // };
      // const clients = await Client.update(cls, {
      //   where: { value: req.body.customer_id },
      // });

      if (
        req.body.challan != "" &&
        req.body.challan != null &&
        typeof req.body.challan != "undefined"
      ) {
        const detail456 = {
          label: req.body.challan,
          doctor_name: req.body.doctor_name,
          invoice_id: invoice_create.value,
          client_id: req.body.customer_id,
        };
        //create new Challan
        const datas789 = await DeliveryChallan.create(detail456);
      }
      //after create new tax_invoice get all the tax_invoice data with decencies
      const data = await TaxInvoice.findByPk(invoice_create.value);
      //for promise req get
      Promise.all([data])
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error retrieving data ",
          });
        });
    } else {
      res.status(500).send({
        message: "Customer credit limit exceeded ",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Failed to perform request",
      detail: error,
    });
  }
};

// For update tax_invoice
exports.update = async (req, res) => {
  // console.log(req.body);
  try {
    var check = 1;
    // For check the client credit limit
    if (
      req.body.customer_id != "" &&
      req.body.customer_id != null &&
      typeof req.body.customer_id != "undefined"
    ) {
      const client = await Client.findByPk(req.body.customer_id);
      if (Number(client.credit_limit) > 0) {
        if (Number(client.credit_limit) >= Number(req.body.due_amount)) {
          check = 0;
        }
      }
    }

    if (check == 1) {
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
        // invoice_num: req.body.invoice_num,
        invoice_date: req.body.date,
        client_name: req.body.customer,
        client_gst: req.body.customerGST,
        client_id: req.body.customer_id,
        reference: req.body.reference,
        patient_name: req.body.patient_name,
        ip_num: req.body.ip_num,
        dl_num: req.body.dl_num,
        po_number: req.body.po_number,
        dc_num: req.body.dc_num,
        total_amount: req.body.dc_num,
        total_amount: req.body.total_amount,
        due_amount: req.body.due_amount,
        discount_amount: req.body.discount_amount,
        sub_totalamt: req.body.sub_totalamt,
        gst_amount: req.body.totalTax,
      };

      //create new invoice data
      const invoice_create = await TaxInvoice.update(detail, {
        where: { value: req.body.value },
      })
        .then((data) => {
          console.log("success");
        })
        .catch((err) => {
          console.log(err);
        });
      const deleteIn = await TaxInvoiceTransaction.destroy({
        where: { invoice_id: req.body.value },
      })
        .then((data) => {
          console.log("success");
        })
        .catch((err) => {
          console.log(err);
        });

      var list = req.body.list;
      for (i = 0; i < list.length; i++) {
        const details2 = {
          invoice_id: req.body.value,
          invoice_date: req.body.date,
          product_name: list[i].product.label,
          hsn: list[i].product.hsn_code,
          sku: list[i].product.sku_code,
          mrp_display: list[i].mrp !== 0 ? list[i].mrp : "-",
          quantity: list[i].qty,
          lot_number: list[i].lot_number,
          discount: list[i].discount,
          price: list[i].price,
          total_amount: list[i].total,
          type: list[i].type,
        };
        await TaxInvoiceTransaction.create(details2);
      }

      // For update credit limit
      // const cls = {
      //   credit_limit: Number(client.credit_limit) - Number(req.body.due_amount),
      // };
      // const clients = await Client.update(cls, {
      //   where: { value: req.body.customer_id },
      // });

      if (
        req.body.challan != "" &&
        req.body.challan != null &&
        typeof req.body.challan != "undefined"
      ) {
        const detail456 = {
          label: req.body.challan,
          doctor_name: req.body.doctor_name,
          invoice_id: invoice_create.value,
          client_id: req.body.customer_id,
        };
        //create new Challan
        const datas789 = await DeliveryChallan.create(detail456);
      }
      //after create new tax_invoice get all the tax_invoice data with decencies
      const data = await TaxInvoice.findByPk(req.body.value);
      //for promise req get
      Promise.all([data])
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: "Error retrieving data ",
          });
        });
    } else {
      res.status(500).send({
        message: "Customer credit limit exceeded ",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Failed to perform request",
      detail: error,
    });
  }
};

//Find All tax_invoice
exports.createPayment = async (req, res) => {
  try {
    const detail = {
      invoice_id: req.body.invoice_id,
      payment_method: req.body.payment_method,
      payment_status: "Paid",
      amount_paid: req.body.amount_paid,
      due_amount: req.body.due_amount,
    };

    const detail2 = {
      due_amount: Number(req.body.due_amount - req.body.amount_paid).toFixed(2),
    };
    const data = await TaxInvoice.update(detail2, {
      where: { value: req.body.invoice_id },
    });

    const client = await Client.findByPk(req.body.customer_id);
    const cls = {
      credit_limit: Number(client.credit_limit) + Number(req.body.amount_paid),
    };
    const clients = await Client.update(cls, {
      where: { value: req.body.customer_id },
    });
    //for get all users with the user decencies
    await TaxInvoicePayment.create(detail)
      .then((data) => {
        //send the success res to
        res.status(200).send({
          data: data,
        });
      })
      .catch((err) => {
        //send the error res to
        res.status(500).send({
          message: "Error retrieving all tax_invoice",
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

exports.tax_value_update = async (req, res) => {
  try {
    const detail = {
      invoice_num: req.body.invoice,
    };
    const clients = await TaxInvoice.update(detail, {
      where: { value: req.body.value },
    }).then((data) => {
      //send the success res to
      res.status(200).send({
        data: data,
      });
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to perform request",
      detail: error,
    });
  }
};

// For delete sale
exports.delete = async (req, res) => {
  try {
    //sale for delete the
    db.taxInvoice
      .destroy({
        where: { value: req.params.value },
      })
      .then((data) => {
        //send the success res to
        res.status(200).send({
          data: data,
        });
      })
      .catch((err) => {
        //send the error res to
        res.status(500).send({
          message: "Error deleting sale",
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
