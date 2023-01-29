/**
 * For Main controller start
 * Import all requires db and models and etc
 */

const db = require("../models");
const Client = db.client; //main db
const Product = db.product;
const TaxInvoice = db.taxInvoice;
const TaxInvoiceTransaction = db.taxInvoiceTransaction;
const User = db.user; //for eager loading depencies
const Group = db.group;
const HSNTax = db.hsnTax;

// Find one client by id
exports.findById = (req, res) => {
  try {
    const id = req.params.id;
    Client.findByPk(id)
      .then((data) => {
        //For send the success to res
        res.send(data);
      })
      .catch((err) => {
        //for send the error to res
        res.status(500).send({
          message: "Error retrieving client with id=" + id + "",
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

//Find All client
exports.findAll = (req, res) => {
  try {
    //for get all users with the user decencies
    Client.findAll({
      order: [["value", "DESC"]],
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
          message: "Error retrieving all client",
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

//Find Client by name
exports.findByName = (req, res) => {
  try {
    //for get all users with the user decencies
    Client.findOne({ where: { label: req.params.id } })
      .then((data) => {
        //send the success res to
        res.status(200).send(data);
      })
      .catch((err) => {
        //send the error res to
        res.status(500).send({
          message: "Error retrieving all client",
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

// For create client
exports.add = async (req, res) => {
  try {
    //add the variable values to req data
    const detail = {
      label: req.body.label,
      phone_number: req.body.phone_number,
      email1: req.body.email1,
      email2: req.body.email2,
      email3: req.body.email3,
      gstin: req.body.gstin,
      alternate: req.body.alternate,
      address: req.body.address,
      state: req.body.state,
      credit_limit: req.body.credit_limit,
    };
    //create new client
    const datas = await Client.create(detail);
    //after create new client get all the client data with decencies
    const data = await Client.findAll({
      order: [["value", "DESC"]],
    });
    //for promise req get
    Promise.all(data)
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

// For update client
exports.update = async (req, res) => {
  try {
    //for store req data to variables
    const detail = {
      label: req.body.label,
      phone_number: req.body.phone_number,
      email1: req.body.email1,
      email2: req.body.email2,
      email3: req.body.email3,
      gstin: req.body.gstin,
      alternate: req.body.alternate,
      address: req.body.address,
      state: req.body.state,
      credit_limit: req.body.credit_limit,
    };
    //update the Client data with value id
    const datas = await Client.update(detail, {
      where: { value: req.body.value },
    });
    const data = await Client.findAll({
      order: [["value", "DESC"]],
    });
    //for promise req get
    Promise.all(data)
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

// For delete client
exports.delete = async (req, res) => {
  try {
    //client for delete the
    Client.destroy({
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
          message: "Error deleting client",
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

// for bulk upload for customer
// exports.bulk_add = async (req, res) => {
//   try {
//     //assign each value in loop
//     const data = req.body;
//     for (let i = 1; i < data.length; i++) {
//       const add_field = {
//         label: data[i][0],
//         phone_number: data[i][4],
//         email1: data[i][1],
//         email2: data[i][2],
//         email3: data[i][3],
//         gstin: data[i][6],
//         alternate: data[i][5],
//         address: data[i][7],
//         state: data[i][8],
//       };
//       //create new cusotmer on loop
//       const size = await Client.create(add_field);
//     }
//     //after loop create send promise respose to req
//     Promise.all([data])
//       .then((data) => {
//         res.send(data);
//       })
//       .catch((err) => {
//         res.status(500).send({
//           message: "Error retrieving data ",
//         });
//       });
//   } catch (error) {
//     res.status(500).send({
//       message: "Failed to perform request",
//       detail: error,
//     });
//   }
// };

// // For product bulk upload
// exports.bulk_add = async (req, res) => {
//   try {
//     console.log(req.body);
//     //assign each value in loop
//     const data = req.body;
//     for (let i = 1; i < data.length; i++) {
//       var hsn = 2;
//       if (data[i][2] == "9021") {
//         hsn = 1;
//       }
//       const add_field = {
//         label: data[i][0],
//         sku_code: data[i][1],
//         group_id: 1,
//         hsn_id: hsn,
//         quantity: data[i][3],
//         price: data[i][4],
//         lot_number: "",
//       };
//       //create new cusotmer on loop
//       const size = await Product.create(add_field);
//     }
//     //after loop create send promise respose to req
//     Promise.all([data])
//       .then((data) => {
//         res.send(data);
//       })
//       .catch((err) => {
//         res.status(500).send({
//           message: "Error retrieving data ",
//         });
//       });
//   } catch (error) {
//     res.status(500).send({
//       message: "Failed to perform request",
//       detail: error,
//     });
//   }
// };

// For tax invoice
// exports.bulk_add = async (req, res) => {
//   try {
//     //assign each value in loop
//     const data = req.body;
//     for (let i = 1; i < data.length; i++) {
//       var gstin = null;
//       var id = null;
//       var name = null;

//       if (data[i][2] !== null && data[i][2] !== "NULL") {
//         const clint = await Client.findOne({ where: { label: data[i][3] } });
//         if (clint != null) {
//           gstin = clint.gstin;
//           id = clint.value;
//           name = clint.label;
//         }
//       }
//       const add_field = {
//         invoice_date: new Date(data[i][0]),
//         invoice_num: data[i][1],
//         client_id: id,
//         client_name: name,
//         client_gst: gstin,
//         reference: data[i][4],
//         patient_name: data[i][5],
//         ip_num: data[i][6],
//         dl_num: data[i][7],
//         dc_num: data[i][8],
//         total_amount: data[i][13],
//         due_amount: data[i][10],
//         discount_amount: data[i][11],
//         sub_totalamt: data[i][9],
//         final_amount: data[i][13],
//         gst_amount: Number(+Number(data[i][14]) + +Number(data[i][15])).toFixed(
//           2
//         ),
//         email_status: "",
//         status: "",
//       };
//       //create new cusotmer on loop
//       const size = await TaxInvoice.create(add_field);
//     }
//     //after loop create send promise respose to req
//     Promise.all([data])
//       .then((data) => {
//         res.send(data);
//       })
//       .catch((err) => {
//         res.status(500).send({
//           message: "Error retrieving data ",
//         });
//       });
//   } catch (error) {
//     res.status(500).send({
//       message: "Failed to perform request",
//       detail: error,
//     });
//   }
// };

// Tax invoice transaction
exports.bulk_add = async (req, res) => {
  try {
    //assign each value in loop
    const data = req.body;
    for (let i = 1; i < data.length; i++) {
      const clint = await TaxInvoice.findByPk(data[i][0]);
      var prods = data[i][1];

      if (typeof data[i][1] == "string") {
        const detail = {
          label: data[i][1],
          sku_code: "",
          hsn_id: 2,
          group_id: 2,
          quantity: 1,
          price: data[i][2],
        };
        const crt = await Product.create(detail);
        prods = crt.value;
      }
      const prod = await Product.findByPk(prods, {
        include: [
          {
            model: Group,
            required: false,
          },
          {
            model: HSNTax,
            required: false,
          },
        ],
      });
      const add_field = {
        invoice_id: clint.value,
        invoice_date: clint.invoice_date,
        product_name: prod.label,
        hsn: prod.hsn_tax.label,
        sku: prod.sku_code,
        mrp_display: data[i][2],
        quantity: data[i][3],
        price: data[i][4],
        total_amount: data[i][5],
        type: prod.group.label,
      };
      //create new cusotmer on loop
      const size = await TaxInvoiceTransaction.create(add_field);
    }
    //after loop create send promise respose to req
    Promise.all([data])
      .then((data) => {
        res.send(data);
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
