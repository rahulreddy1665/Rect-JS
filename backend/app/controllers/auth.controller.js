/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

//main db models required
const db = require("../models");
const config = require("../config/auth.config"); //for token encrypt config file import
const User = db.user; //main db import

var jwt = require("jsonwebtoken"); // Import jsonwebtoken for
var bcrypt = require("bcryptjs"); // Import password encryption tool

//For signin users verifying and give new token
exports.signin = (req, res) => {
  //first find user with email id
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      //if user not found with the email check with phone number
      if (!user) {
        User.findOne({
          where: {
            phone_number: req.body.email,
          },
        }).then((user) => {
          //both email and phone number not found send user not found
          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          } else {
            //if user get by phone number check password
            var passwordIsValid = bcrypt.compareSync(
              req.body.password,
              user.password
            );
            //if password not valid send invalid password
            if (!passwordIsValid) {
              return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!",
              });
            }
            //if password verify give new token with secrete key
            var token = jwt.sign(
              { id: user.value, name: user.label },
              config.secret
            );
            //for send success and user details along with it token
            res.status(200).send({
              id: user.value,
              name: user.name,
              roles: user.role,
              accessToken: token,
            });
          }
        });
      } else {
        //if user get by phone number check password
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        //if password not valid send invalid password
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }
        //if password verify give new token with secrete key
        var token = jwt.sign(
          { id: user.value, name: user.name, role: user.role },
          config.secret
        );
        //for send success and user details along with it token
        res.status(200).send({
          id: user.value,
          name: user.name,
          roles: user.role,
          accessToken: token,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
