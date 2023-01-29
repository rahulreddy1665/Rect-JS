/**
 * Application Name: Dhanasruserjicals
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const db = require("../models");
const Account = db.account;
const bcrypt = require("bcryptjs");

module.exports = function () {
  return Account.bulkCreate([
    {
      gstin: "29BBEPS6455H1Z5",
      dl1: "KA/MYSU/1/20B-709",
      dl2: "KA/MYSU/1/21B-666",
      company: "Dhanashree Surgicals",
    },
  ]);
};
