/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const UserSeed = require("./user");
const GroupSeed = require("./group");
const Account = require("./account");

module.exports = async function () {
  await Promise.all([UserSeed(), GroupSeed(), Account()])
    .then(() => {
      // More seeds that require IDs from the seeds above
    })
    .then((res) => {
      console.log("********** Successfully seeded db **********");
    })
    .catch((err) => {
      console.log(err);
    });
};
