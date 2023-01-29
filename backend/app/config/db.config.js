/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

// For local host db config
module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "dhanashreesurgicals",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// for server
// module.exports = {
//   HOST: "localhost",
//   USER: "rvuser",
//   PASSWORD: "~5HgrU8bhVQ",
//   DB: "rvdb",
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// };
