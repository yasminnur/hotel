const express = require("express");
var body = require("body-parser");

const app = express();

app.use(express.json());

const userController = require("../controllers/user_controller");
const auth = require(`../auth/auth`);

app.post("/login", userController.login);
app.get("/user", auth.authVerify, userController.getAll);
app.post("/find", auth.authVerify, userController.findUser);
app.post("/add", auth.authVerify, userController.addUser);
app.delete("/delete/:id", auth.authVerify, userController.deleteUser);
app.put("/update/:id", auth.authVerify, userController.updateUser);

module.exports = app;
