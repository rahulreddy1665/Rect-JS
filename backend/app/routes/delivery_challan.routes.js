/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const { authJwt } = require("../middleware");
const controller = require("../controllers/delivery_challan.controller");

module.exports = function (app) {
  app.get("/api/delivery_challan", [authJwt.verifyToken], controller.findAll); //get all the delivery_challan data
  app.get(
    "/api/delivery_challan/:id",
    [authJwt.verifyToken],
    controller.findById
  ); //get all the delivery_challan data
  app.get(
    "/api/delivery_challan_name/:id",
    [authJwt.verifyToken],
    controller.findByName
  ); //get all the delivery_challan name wise data
  app.post("/api/delivery_challan", [authJwt.verifyToken], controller.add); //create new delivery_challan
  app.patch("/api/delivery_challan", [authJwt.verifyToken], controller.update); //update delivery_challan data
  app.delete(
    "/api/delivery_challan/:value",
    [authJwt.verifyToken],
    controller.delete
  ); //delete delivery_challan
};
