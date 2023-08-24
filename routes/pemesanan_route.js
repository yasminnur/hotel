/** load library express */
const express = require(`express`);
/** initiate object that instance of express */
const app = express();
/** allow to read 'request' with json type */
app.use(express.json());
/** load pemesanan's controller */
const pemesananController = require(`../controllers/pemesanan_controller`);
const auth = require(`../auth/auth`);

app.get("/pemesanan", auth, pemesananController.getPemesanan);
app.post("/add", auth, pemesananController.addPemesanan);
app.post("/find", auth, pemesananController.findPemesanan);
app.put("/update/:id", auth, pemesananController.updatePemesanan);
app.delete("/delete/:id", auth, pemesananController.deletePemesanan);
module.exports = app;
