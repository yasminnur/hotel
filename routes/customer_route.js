const express = require("express");
var body = require("body-parser");

const app = express();

app.use(express.json());

const customerController = require("../controllers/customer_controller");

// app.post("/login", customerController.login);
app.get("/customer", customerController.getAll);
app.post("/find", customerController.findCustomer);
app.post("/add", customerController.addCustomer);
app.delete("/delete/:id", customerController.deleteCustomer);
app.put("/update/:id", customerController.updateCustomer);

module.exports = app;
