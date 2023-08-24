const express = require(`express`);
const app = express();
const PORT = 4000;
const cors = require(`cors`);
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** define all routes */
const customerRoute = require(`./routes/customer_route`);
const userRoute = require(`./routes/user_route`);
const kamarRoute = require(`./routes/kamar_route`);
const tipeKamarRoute = require(`./routes/tipe_kamar_route`);
const pemesananRoute = require(`./routes/pemesanan_route`);
const detailPemesananRoute = require(`./routes/detail_pemesanan_route`);

/** define prefix for each route */
app.use(`/customer`, customerRoute);
app.use(`/user`, userRoute);
app.use(`/kamar`, kamarRoute);
app.use(`/tipeKamar`, tipeKamarRoute);
app.use(`/pemesanan`, pemesananRoute);
app.use(`/detailPemesanan`, detailPemesananRoute);
app.use(express.static(__dirname));
app.use(express.static("photo"));

app.listen(PORT, () => {
  console.log(`Server of hotel runs on port ${PORT}`);
});
