/**
 * Application Name: Royal Volunteers Front End
 * Application Version: 1.0
 * Author: Zevcore Private Limited
 * Last Modified Date: 04.07.2022
 * Developer Name: Suhas S
 */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Seed = require("./app/seed");

// Import patch for joins access to image
var path = require("path");
const app = express();

// For setting the cors options for backend
var corsOptions = {
  origin: "*",
};

// Setting cors
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: "50mb" }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));

app.use("/public", express.static(path.join(__dirname, "public")));
const db = require("./app/models");
// change commented code to fresh migrate the data
db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
//   Seed();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Connected.....!!" });
});

// Routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/client.routes")(app);
require("./app/routes/group.routes")(app);
require("./app/routes/hsn_tax.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/taxInvoice.routes")(app);
require("./app/routes/saveTaxInvoice.routes")(app);
require("./app/routes/proformaInvoice.route")(app);
require("./app/routes/dashboard.routes")(app);
require("./app/routes/delivery_challan.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
