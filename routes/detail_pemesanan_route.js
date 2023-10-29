const express = require(`express`)
const app = express()
const detailPemesananController = require(`../controllers/detail_pemesanan_controller`)

app.use(express.json())

app.get("/detailPemesanan", detailPemesananController.getAlldetailPemesanan)
app.post("/add", detailPemesananController.adddetailPemesanan)
// app.get("/find", detailPemesananController.finddetailPemesanan)
app.put("/update/:id", detailPemesananController.updatedetailPemesanan)
// app.delete("/delete/:id", detailPemesananController.deletedetailPemesanan)

module.exports = app