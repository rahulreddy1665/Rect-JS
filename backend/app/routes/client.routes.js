/**
 * Application Name: Royal Volunteers Back End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const { authJwt } = require("../middleware");
const controller = require("../controllers/client.controller");

module.exports = function (app) {
  app.get("/api/client", controller.findAll); //get all the client data
  app.get("/api/client/:id", [authJwt.verifyToken], controller.findById); //get all the client data
  app.get("/api/client_name/:id", [authJwt.verifyToken], controller.findByName); //get all the client name wise data
  app.post("/api/client", [authJwt.verifyToken], controller.add); //create new client
  app.patch("/api/client", [authJwt.verifyToken], controller.update); //update client data
  app.delete("/api/client/:value", [authJwt.verifyToken], controller.delete); //delete client

  app.post("/api/client_bulk", [authJwt.verifyToken], controller.bulk_add); //delete client
};
