/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const { authJwt } = require("../middleware");
const controller = require("../controllers/dashboard.controller");

module.exports = function (app) {
  app.post("/api/reportDate", [authJwt.verifyToken], controller.reportTwoDate); // For get all the count and last 10 register user and request to dashboard

  app.get("/api/dashboard", [authJwt.verifyToken], controller.dashboard);
};
