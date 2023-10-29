const express = require(`express`);
const app = express();
app.use(express.json());
const kamarController = require(`../controllers/kamar_controller`);
const auth = require(`../auth/auth`);

/** create route to get data with method "GET" */
app.get("/kamar", auth.authVerify, kamarController.getAllKamar);
app.post("/add", auth.authVerify, kamarController.addKamar);
app.post("/find", auth.authVerify, kamarController.findKamar);
app.post("/available", kamarController.getAvailable);
app.put("/update/:id", auth.authVerify, kamarController.updateKamar);
app.delete("/delete/:id", auth.authVerify, kamarController.deleteKamar);
module.exports = app;
