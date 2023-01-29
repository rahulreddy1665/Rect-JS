/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const { authJwt } = require("../middleware");
const controller = require("../controllers/group.controller");

module.exports = function (app) {
  app.get("/api/group", [authJwt.verifyToken], controller.findAll); //get all the group data
  app.get("/api/group/:id", [authJwt.verifyToken], controller.findById); //get all the group data
  app.get("/api/group_name/:id", [authJwt.verifyToken], controller.findByName); //get all the group name wise data
  app.post("/api/group", [authJwt.verifyToken], controller.add); //create new group
  app.patch("/api/group", [authJwt.verifyToken], controller.update); //update group data
  app.delete("/api/group/:value", [authJwt.verifyToken], controller.delete); //delete group
};
