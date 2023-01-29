/**
 * For Main controller start
 * Import all requires db and models and etc
 */

const db = require("../models");
const Product = db.product; //main db
const Group = db.group;
const HSNTax = db.hsnTax;
const User = db.user; //for eager loading depencies

// Find one product by id
exports.findById = (req, res) => {
  try {
    const id = req.params.id;
    Product.findByPk(id)
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
    Product.findAll({
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

//Find Product by name
exports.findByName = (req, res) => {
  try {
    //for get all users with the user decencies
    Product.findOne({ where: { label: req.params.id } })
      .then((data) => {
        //send the success res to
        res.status(200).send(data);
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
    //add the variable values to req data
    const detail = {
      label: req.body.label,
      sku_code: req.body.sku_code,
      hsn_id: req.body.hsn_id,
      group_id: req.body.group_id,
      quantity: req.body.quantity,
      price: req.body.price,
      lot_number: req.body.lot_number,
    };
    //create new product
    const datas = await Product.create(detail);
    //after create new product get all the product data with decencies
    const data = await Product.findAll({
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

// For update product
exports.update = async (req, res) => {
  try {
    //for store req data to variables
    const detail = {
      label: req.body.label,
      sku_code: req.body.sku_code,
      hsn_id: req.body.hsn_id,
      group_id: req.body.group_id,
      quantity: req.body.quantity,
      price: req.body.price,
      lot_number: req.body.lot_number,
    };
    //update the Product data with value id
    const datas = await Product.update(detail, {
      where: { value: req.body.value },
    });
    const data = await Product.findAll({
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

// For delete product
exports.delete = async (req, res) => {
  try {
    //product for delete the
    Product.destroy({
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
          message: "Error deleting product",
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
        lot_number: data[i][5],
      };
      //create new cusotmer on loop
      const size = await Product.create(add_field);
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
