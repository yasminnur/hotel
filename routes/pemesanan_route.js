/** load library express */
const express = require(`express`);
/** initiate object that instance of express */
const app = express();
/** allow to read 'request' with json type */
app.use(express.json());
/** load pemesanan's controller */
const pemesananController = require(`../controllers/pemesanan_controller`);
const auth = require(`../auth/auth`);

app.get("/pemesanan", pemesananController.getAllPemesanan);
app.post("/add", pemesananController.addPemesanan);
// app.post("/findCheck", pemesananController.findPemesananCheck);
app.post("/find", pemesananController.findPemesanan);
app.post("/findCust", pemesananController.findPemesananCust);
app.get("/getByUser/:email", pemesananController.getByUser);
app.put("/updateStatusPemesanan/:id", pemesananController.updateStatusBooking)
module.exports = app;
