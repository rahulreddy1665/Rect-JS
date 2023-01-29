/**
 * Application Name: Dhanasruserjicals
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const db = require("../models");
const Group = db.group;

module.exports = function () {
  return Group.bulkCreate([
    {
      label: "Implant",
    },
    {
      label: "Instrumental",
    },
  ]);
};
