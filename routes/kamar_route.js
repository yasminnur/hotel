const express = require(`express`);
const app = express();
app.use(express.json());
const kamarController = require(`../controllers/kamar_controller`);
const auth = require(`../auth/auth`);

/** create route to get data with method "GET" */
app.get("/kamar", auth, kamarController.getAllKamar);
app.post("/add", auth, kamarController.addKamar);
app.post("/find", auth, kamarController.findKamar);
app.put("/update/:id", auth, kamarController.updateKamar);
app.delete("/delete/:id", auth, kamarController.deleteKamar);
module.exports = app;
