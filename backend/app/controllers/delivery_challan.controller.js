/**
 * For Main controller start
 * Import all requires db and models and etc
 */

const db = require("../models");
const DeliveryChallan = db.deliveryChallan; //main db
const TaxInvoice = db.taxInvoice;
const Client = db.client;

// Find one Challan by id
exports.findById = (req, res) => {
  try {
    const id = req.params.id;
    DeliveryChallan.findByPk(id, {
      include: [
        {
          model: TaxInvoice,
          required: false,
        },
        {
          model: Client,
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
          message: "Error retrieving Challan with id=" + id + "",
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

//Find All Challan
exports.findAll = (req, res) => {
  try {
    //for get all users with the user decencies
    DeliveryChallan.findAll({
      include: [
        {
          model: TaxInvoice,
          required: false,
        },
        {
          model: Client,
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
          message: "Error retrieving all Challan",
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

//Find DeliveryChallan by name
exports.findByName = (req, res) => {
  try {
    //for get all users with the user decencies
    DeliveryChallan.findOne({ where: { label: req.params.id } })
      .then((data) => {
        //send the success res to
        res.status(200).send(data);
      })
      .catch((err) => {
        //send the error res to
        res.status(500).send({
          message: "Error retrieving all Challan",
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

// For create Challan
exports.add = async (req, res) => {
  try {
    //add the variable values to req data
    const detail = {
      label: req.body.label,
      doctor_name: req.body.doctor_name,
      invoice_id: req.body.invoice_id,
      client_id: req.body.client_id,
    };
    //create new Challan
    const datas = await DeliveryChallan.create(detail);
    //after create new Challan get all the Challan data with decencies
    const data = await DeliveryChallan.findAll({
      include: [
        {
          model: TaxInvoice,
          required: false,
        },
        {
          model: Client,
          required: false,
        },
      ],
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

// For update Challan
exports.update = async (req, res) => {
  try {
    //for store req data to variables
    const detail = {
      label: req.body.label,
      doctor_name: req.body.doctor_name,
      invoice_id: req.body.invoice_id,
      client_id: req.body.client_id,
    };
    //update the DeliveryChallan data with value id
    const datas = await DeliveryChallan.update(detail, {
      where: { value: req.body.value },
    });
    const data = await DeliveryChallan.findAll({
      include: [
        {
          model: TaxInvoice,
          required: false,
        },
        {
          model: Client,
          required: false,
        },
      ],
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

// For delete Challan
exports.delete = async (req, res) => {
  try {
    //Challan for delete the
    DeliveryChallan.destroy({
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
          message: "Error deleting Challan",
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

// for bulk upload
exports.bulk_add = async (req, res) => {
  try {
    //assign each value in loop
    const data = req.body.data_list;
    for (let i = 1; i < data.length; i++) {
      const add_field = {
        label: data[i][0],
        sku_code: data[i][1],
        hsn_code: data[i][2],
        quantity: data[i][3],
        price: data[i][4],
      };
      //create new cusotmer on loop
      const size = await DeliveryChallan.create(add_field);
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
