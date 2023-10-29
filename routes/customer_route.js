const express = require("express");
var body = require("body-parser");

const app = express();

app.use(express.json());

const customerController = require("../controllers/customer_controller");
const auth = require(`../auth/auth`);

app.post("/register", customerController.register);
app.post("/login", customerController.login);

module.exports = app;
