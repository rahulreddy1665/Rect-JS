/**
 * For Main controller start
 * Import all requires db and models and etc
 */

const db = require("../models");
const Group = db.group; //main db

const User = db.user; //for eager loading depencies

// Find one group by id
exports.findById = (req, res) => {
  try {
    const id = req.params.id;
    Group.findByPk(id)
      .then((data) => {
        //For send the success to res
        res.send(data);
      })
      .catch((err) => {
        //for send the error to res
        res.status(500).send({
          message: "Error retrieving group with id=" + id + "",
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

//Find All group
exports.findAll = (req, res) => {
  try {
    //for get all users with the user decencies
    Group.findAll()
      .then((data) => {
        //send the success res to
        res.status(200).send({
          data: data,
        });
      })
      .catch((err) => {
        //send the error res to
        res.status(500).send({
          message: "Error retrieving all group",
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

//Find Group by name
exports.findByName = (req, res) => {
  try {
    //for get all users with the user decencies
    Group.findOne({ where: { label: req.params.id } })
      .then((data) => {
        //send the success res to
        res.status(200).send(data);
      })
      .catch((err) => {
        //send the error res to
        res.status(500).send({
          message: "Error retrieving all group",
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

// For create group
exports.add = async (req, res) => {
  try {
    //add the variable values to req data
    const detail = {
      label: req.body.label,
    };
    //create new group
    const datas = await Group.create(detail);
    //after create new group get all the group data with decencies
    const data = await Group.findAll();
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

// For update group
exports.update = async (req, res) => {
  try {
    //for store req data to variables
    const detail = {
      label: req.body.label,
    };
    //update the Group data with value id
    const datas = await Group.update(detail, {
      where: { value: req.body.value },
    });
    const data = await Group.findAll();
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

// For delete group
exports.delete = async (req, res) => {
  try {
    //group for delete the
    Group.destroy({
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
          message: "Error deleting group",
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
      const size = await Group.create(add_field);
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
