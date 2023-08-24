/** load library express */
const express = require(`express`);
/** initiate object that instance of express */
const app = express();
/** allow to read 'request' with json type */
app.use(express.json());
/** load tipeKamar's controller */
const tipeKamarController = require(`../controllers/tipe_kamar_controller`);
// const auth = require(`../auth/auth`);

/** create route to get data with method "GET" */
app.get("/tipeKamar",tipeKamarController.getAlltipeKamar);
app.post("/add", tipeKamarController.addTipeKamar);
app.post("/find", tipeKamarController.findTipeKamar);
app.put("/update/:id", tipeKamarController.updateTipeKamar);
app.delete("/delete/:id", tipeKamarController.deleteTipeKamar);
module.exports = app;
