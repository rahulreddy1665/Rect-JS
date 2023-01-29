/**
 * Application Name: Dhanasruserjicals
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");

module.exports = function () {
  return User.bulkCreate([
    {
      name: "Abhishek",
      phone_number: 9886655586,
      alternate_num: 9448386150,
      image: "images.png",
      email: "admin@dhanashreesurgicals.com",
      password: bcrypt.hashSync("Demo@2022", 8),
      role: "Administrator",
      gst_id: "29BBEPS6455H1Z5",
      dlone: "KA/MYSU/1/20B-709",
      dltwo: "KA/MYSU/1/21B-666",
    },
  ]);
};
