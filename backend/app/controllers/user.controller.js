/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const db = require("../models");
const config = require("../config/auth.config"); //for token encrypt config file import
const User = db.user;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken"); //import jsonwebtoken for
var bcrypt = require("bcryptjs"); //import password encription tool

// Find one user by id
exports.findById = (req, res) => {
  const id = req.userId;
  User.findByPk(id, { attributes: { exclude: ["password"] } })
    .then((data) => {
      res.status(200).send({
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User ",
      });
    });
};

// check for user already register with same phone no
exports.user_phone = (req, res) => {
  User.findOne({
    where: {
      phone_number: req.body.phone_number,
    },
  })
    .then(async (data) => {
      if (!data) {
        var otp = Math.floor(100000 + Math.random() * 900000);
        const user = {
          otp: otp,
          hash_value: req.body.hash_value,
          phone: "91" + req.body.phone_number.toString(),
        };
        const detail = {
          phone_number: req.body.phone_number,
          otp: otp,
          role: "User",
        };
        // for create the new user data
        await User.create(detail);

        return res.status(404).send({ message: "User Not found." });
      } else {
        res.status(200).send({
          data: data,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User ",
      });
    });
};

//Find All users
exports.userAll = (req, res) => {
  User.findAll({
    attributes: { exclude: ["password"] },
    where: {
      value: {
        [Op.not]: 1,
      },
    },
    order: [["createdAt", "DESC"]],
  })
    .then((data) => {
      res.status(200).send({
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User",
        error: err,
      });
    });
};

// for get total no of users
exports.findTotalUser = async (req, res) => {
  try {
    //get total user count
    const userCount = await User.count();

    //get the promise list and send req
    Promise.all([userCount])
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
      message: "Catch error",
      error: error,
    });
  }
};

// for create the new user on mobile register
exports.createUser = async (req, res) => {
  try {
    // For create user

    //check for user with same phone no
    const data2 = await User.findOne({
      where: { phone_number: req.body.phone_number },
    });

    if (data2 == null) {
      res.status(500).send({
        message: "Catch error",
        error: error,
      });
    } else {
      var age = new Date().getFullYear() - new Date(req.body.age).getFullYear();

      if (age >= 18) {
        const detail = {
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
          age: req.body.age,
          blood_group: req.body.blood_group,
          availability: req.body.availability,
          account_status: "Active",
          pincode: req.body.pincode,
          firebase_token: req.body.firebase_token,
          role: "User",
        };
        // for create the new user data
        const new_Data = await User.update(detail, {
          where: { phone_number: req.body.phone_number },
        });
        // for get all the user after create
        var token = jwt.sign(
          { id: data2.value, name: req.body.name, role: "User" },
          config.secret
        );
        res.status(200).send({
          id: data2.value,
          name: req.body.name,

          roles: "User",
          accessToken: token,
        });
      } else {
        res.status(500).send({
          message: "Age cannot be less than 18 years",
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: "Age cannot be less than 18 years",
      error: error,
    });
  }
};

// For create user
exports.add = async (req, res) => {
  const data2 = await User.findOne({
    where: { phone_number: req.body.phone_number },
  });
  if (data2 == null) {
    const detail = {
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      phone_number: req.body.phone_number,
      age: req.body.age,
      blood_group: req.body.blood_group,
      availability: req.body.availability,
      account_status: "Active",
      pincode: req.body.pincode,
      role: "User",
    };
    // for create the user data
    User.create(detail)
      .then((user) => {
        User.findAll({
          attributes: { exclude: ["password", "firebase_token"] },
          where: {
            value: {
              [Op.not]: 1,
            },
          },
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: User,
              required: false,
              as: "added_user",
              attributes: ["value", "label"],
            },
            {
              model: User,
              required: false,
              as: "updated_user",
              attributes: ["value", "label"],
            },
          ],
        })
          .then((data) => {
            res.send({ data });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error retrieving data ",
            });
          });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error adding user",
        });
      });
  } else {
    res.status(500).send({
      message: "Error user already register with same Phone No ",
    });
  }
};

// For update user
exports.update = async (req, res) => {
  var id = req.userId;
  // check for login id
  var detail = "";
  if (req.body.password !== "") {
    detail = {
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      phone_number: req.body.phone_number,
    };
  } else {
    detail = {
      name: req.body.name,
      email: req.body.email,
      phone_number: req.body.phone_number,
    };
  }
  await User.update(detail, {
    where: { value: id },
  });

  // After update get all the users list
  const data = await User.findAll({
    attributes: { exclude: ["password", "firebase_token"] },
    where: {
      value: {
        [Op.not]: 1,
      },
    },
    order: [["createdAt", "DESC"]],
  });
  Promise.all(data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving data ",
      });
    });
};

// For delete user
exports.delete = async (req, res) => {
  User.destroy({
    where: { value: req.params.id },
  })
    .then((data) => {
      res.status(200).send({
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error deleting tax",
        detail: err,
      });
    });
};

// for password reset with mobile app
exports.password_reset = async (req, res) => {
  const detail = {
    password: bcrypt.hashSync(req.body.password, 8),
  };
  const user = await User.findOne({
    where: {
      phone_number: req.body.phone_number,
    },
  });

  await User.update(detail, {
    where: { phone_number: req.body.phone_number },
  })
    .then((data) => {
      res.send({ message: "Password updated" });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving data ",
      });
    });
};

// for update user password
exports.UpdatePassword = async (req, res) => {
  try {
    User.findByPk(req.userId)
      .then((user) => {
        var passwordIsValid = bcrypt.compareSync(
          req.body.old_password,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Old Password!",
          });
        }

        const detail = {
          password: bcrypt.hashSync(req.body.password, 8),
        };
        User.update(detail, {
          where: { value: req.userId },
        })
          .then((data) => {
            res.send({ message: "Password updated" });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error retrieving data ",
            });
          });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving data ",
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Catch error",
      error: error,
    });
  }
};

// For delete user
exports.block = async (req, res) => {
  const update = await User.update(
    { account_status: req.body.status },
    {
      where: { value: req.body.user_id },
    }
  );
  const data = await User.findAll({
    attributes: { exclude: ["password", "firebase_token"] },
    where: {
      value: {
        [Op.not]: 1,
      },
    },
    order: [["createdAt", "DESC"]],
  });
  Promise.all(data)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving data ",
      });
    });
};

// For update user
exports.user_bulk = async (req, res) => {
  const data = req.body.data_list;

  for (let i = 1; i < data.length; i++) {
    var availability = 0;
    if (data[i][5] == "N") {
      availability = 1;
    }

    const add_field = {
      name: data[i][0],
      phone_number: data[i][1],
      blood_group: data[i][2],
      pincode: data[i][3],
      age: new Date(data[i][4]),
      availability: availability,
      account_status: "Active",
      role: "User",
    };
    const size = await User.create(add_field);
  }
  Promise.all([data])
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving data ",
      });
    });
};

// For resend otp for user
exports.resendOtp = async (req, res) => {
  const user = await User.findOne({
    where: { phone_number: req.body.phone_number },
  });
  if (user != null) {
    var otp = Math.floor(100000 + Math.random() * 900000);
    const user = {
      otp: otp,
      hash_value: req.body.hash_value,
      phone: "91" + req.body.phone_number.toString(),
    };
    smsClient.sedRegisterOtp(user);
    const add_field = {
      otp: otp,
    };
    const datas = await User.update(add_field, {
      where: { phone_number: req.body.phone_number },
    });

    Promise.all([datas])
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving data ",
        });
      });
  } else {
    res.status(400).send({
      message: "No User found",
    });
  }
};

// For verify otp
exports.optVerify = async (req, res) => {
  const user = await User.findOne({
    where: { phone_number: req.body.phone_number },
  });
  if (user != null) {
    if (user.otp == req.body.otp) {
      res.status(200).send({
        message: "OTP Verified",
      });
    } else {
      res.status(400).send({
        message: "OTP Not-Match",
      });
    }
  } else {
    res.status(400).send({
      message: "No User found",
    });
  }
};

// for bulk upload
