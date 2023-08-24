const express = require("express");
var body = require("body-parser");

const app = express();

app.use(express.json());

const userController = require("../controllers/user_controller");
const auth = require(`../auth/auth`);

app.post("/login", userController.login);
app.get("/user", auth, userController.getAll);
app.post("/find", auth, userController.findUser);
app.post("/add", auth, userController.addUser);
app.delete("/delete/:id", auth, userController.deleteUser);
app.put("/update/:id", auth, userController.updateUser);

module.exports = app;
