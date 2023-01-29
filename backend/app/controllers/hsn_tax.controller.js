/**
 * For Main controller start
 * Import all requires db and models and etc
 */

const db = require("../models");
const HSNTax = db.hsnTax; //main db
const Account = db.account;
const User = db.user; //for eager loading depencies

// Find one hsn by id
exports.findById = (req, res) => {
  try {
    const id = req.params.id;
    HSNTax.findByPk(id)
      .then((data) => {
        //For send the success to res
        res.send(data);
      })
      .catch((err) => {
        //for send the error to res
        res.status(500).send({
          message: "Error retrieving hsn with id=" + id + "",
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

//Find All hsn
exports.findAll = (req, res) => {
  try {
    //for get all hsn
    HSNTax.findAll()
      .then((data) => {
        //send the success res to
        res.status(200).send({
          data: data,
        });
      })
      .catch((err) => {
        //send the error res to
        res.status(500).send({
          message: "Error retrieving all hsn",
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

//Find hsn by name
exports.findByName = (req, res) => {
  try {
    //for get all hsn
    HSNTax.findOne({ where: { label: req.params.id } })
      .then((data) => {
        //send the success res to
        res.status(200).send(data);
      })
      .catch((err) => {
        //send the error res to
        res.status(500).send({
          message: "Error retrieving all hsn",
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

// For create hsn
exports.add = async (req, res) => {
  try {
    //add the variable values to req data
    const detail = {
      label: req.body.label,
      tax: req.body.tax,
    };
    //create new hsn
    const datas = await HSNTax.create(detail);
    //after create new hsn get all the hsn data with decencies
    const data = await HSNTax.findAll();
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

// For update hsn
exports.update = async (req, res) => {
  try {
    //for store req data to variables
    const detail = {
      label: req.body.label,
      tax: req.body.tax,
    };
    //update the hsn data with value id
    const datas = await HSNTax.update(detail, {
      where: { value: req.body.value },
    });
    const data = await HSNTax.findAll();
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

// For delete hsn
exports.delete = async (req, res) => {
  try {
    //hsn for delete the
    HSNTax.destroy({
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
          message: "Error deleting hsn",
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
      const size = await hsn.create(add_field);
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

// Find one hsn by id
exports.findOneA = (req, res) => {
  try {
    Account.findByPk(1)
      .then((data) => {
        //For send the success to res
        res.send(data);
      })
      .catch((err) => {
        //for send the error to res
        res.status(500).send({
          message: "Error retrieving hsn with id=" + id + "",
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

exports.createA = async (req, res) => {
  try {
    const find = await Account.findByPk(1);
    //add the variable values to req data
    const detail = {
      gstin: req.body.gstin,
      dl1: req.body.dl1,
      dl2: req.body.dl2,
      company: req.body.company,
    };
    if (find == null) {
      const datas = await Account.create(detail);
    } else {
      const datas = await Account.update(detail, {
        where: { value: req.body.value },
      });
    }
    //create new hsn

    //after create new hsn get all the hsn data with decencies
    const data = await Account.findByPk(1);
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
