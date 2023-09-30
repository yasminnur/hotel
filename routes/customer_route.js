const express = require("express");
var body = require("body-parser");

const app = express();

app.use(express.json());

const customerController = require("../controllers/customer_controller");
const auth = require(`../auth/auth`);

app.post("/login", customerController.login);
app.get("/customer", auth, customerController.getAll);
app.post("/find", auth, customerController.findCustomer);
app.post("/add", auth, customerController.addCustomer);
app.delete("/delete/:id", auth, customerController.deleteCustomer);
app.put("/update/:id", auth, customerController.updateCustomer);

module.exports = app;
