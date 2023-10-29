// const { request, response } = require("express")
const detailOfPemesananModel = require(`../models/index`).detail_pemesanan;
const pemesananModel = require(`../models/index`).pemesanan;
const modelUser = require(`../models/index`).user;
const kamarModel = require(`../models/index`).kamar;
const modelCustomer = require(`../models/index`).customer;
const tipe_kamarModel = require(`../models/index`).tipe_kamar;
const moment = require("moment");

const Op = require("sequelize").Op;
const Sequelize = require("sequelize");
const sequelize = new Sequelize("hotelbaru", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// GET ALL PEMESANAN
exports.getAllPemesanan = async (request, response) => {
  try {
    let pemesanans = await pemesananModel.findAll({
      include: {
        model: tipe_kamarModel,
        attributes: ["nama_tipe_kamar"],
      },
      order: [["createdAt", "DESC"]],
    });
    if (pemesanans.length === 0) {
      return response.json({
        success: true,
        data: [],
        message: `Data tidak ditemukan`,
      });
    }
    return response.json({
      success: true,
      data: pemesanans,
      message: `semua data sukses ditampilkan sesuai yang anda minta tuan`,
    });
  } catch {
    response.send("err");
  }
};

// GET PEMESANAN BY USER
exports.getByUser = async (request, response) => {
  let email = request.params.email;

  const result = await pemesananModel.findAll({
    include: {
      model: tipe_kamarModel,
      attributes: ["nama_tipe_kamar", "harga"],
    },
    where: {
      email_pemesan: email,
    },
    order: [["createdAt", "DESC"]],
  });
  if (result.length === 0) {
    return response.json({
      success: true,
      data: [],
      message: "Data tidak ditemukan",
    });
  }

  response.json({
    success: true,
    data: result,
    message: `All Transaction have been loaded...`,
  });
};

exports.findPemesanan = async (request, response) => {
  try {
    let keyword = request.body.keyword;
    // let tgl_check_in = request.body.tgl_check_in;
    let tgl_check_in = new Date(request.body.tgl_check_in);

    
    let pemesanans = await pemesananModel.findAll({
      where: {
        [Op.or]: [
          { nama_tamu: { [Op.substring]: keyword } },
          { nomor_pemesanan: { [Op.substring]: keyword } },
          { tgl_check_in:  tgl_check_in },
        ],
        // tgl_check_in: { [Op.gte]: tgl_check_in },
      },
      include: {
        model: tipe_kamarModel,
        attributes: ['nama_tipe_kamar'],
      },
    });
    
    if (pemesanans.length === 0) {
      return response.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }
    
    return response.json({
      success: true,
      data: pemesanans,
      message: "All rooms have been loaded",
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};
// FIND PEMESANAN
// exports.findPemesanan = async (request, response) => {
//   try {
//     let keyword = request.body.keyword;
//     let tgl_check_in = new Date(request.body.tgl_check_in);

//     let pemesanans = await pemesananModel.findAll({
//       where: {
//         [Op.or]: [{ nama_tamu: { [Op.substring]: keyword } },
//           tgl_check_in: tgl_check_in,
//         ],
        
//       },
//       include: {
//         model: tipe_kamarModel,
//         attributes: ["nama_tipe_kamar"],
//       },
//     });
//     console.log("ini pemesanans " + keyword);
//     if (pemesanans.length === 0) {
//       return response.status(404).json({
//         success: false,
//         message: "Data tidak ditemukan",
//       });
//     }

//     return response.json({
//       success: true,
//       data: pemesanans,
//       message: "All rooms have been loaded",
//     });
//   } catch (error) {
//     console.error(error);
//     return response.status(500).json({
//       success: false,
//       message: "Terjadi kesalahan server",
//     });
//   }
// };

// FIND UTK CUSTOMER (nomor pemesanan)
exports.findPemesananCust = async (request, response) => {
  try {
    let keyword = request.body.keyword;

    let pemesanans = await pemesananModel.findAll({
      where: {
        [Op.or]: [{ nomor_pemesanan: { [Op.substring]: keyword } }],
      },
      include: {
        model: tipe_kamarModel,
        attributes: ["nama_tipe_kamar"],
      },
    });

    if (pemesanans.length === 0) {
      return response.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    return response.json({
      success: true,
      data: pemesanans,
      message: "All rooms have been loaded",
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};

// FIND UTK CHECKIN
// exports.findPemesananCheck = async (request, response) => {
//   try {
//     let tgl_check_in = new Date(request.body.tgl_check_in);

//     let pemesanans = await pemesananModel.findAll({
//       where: {
//         tgl_check_in: tgl_check_in,
//       },
//       include: {
//         model: tipe_kamarModel,
//         attributes: ["nama_tipe_kamar"],
//       },
//     });

//     if (pemesanans.length === 0) {
//       return response.status(404).json({
//         success: false,
//         message: "Data tidak ditemukan",
//       });
//     }

//     return response.json({
//       success: true,
//       data: pemesanans,
//       message: "All rooms have been loaded",
//     });
//   } catch (error) {
//     console.error(error);
//     return response.status(500).json({
//       success: false,
//       message: "Terjadi kesalahan server",
//     });
//   }
// };

// ADD PEMESANAN
exports.addPemesanan = async (request, response) => {
  let nama = request.body.nama_pemesan;
  let custId = await modelCustomer.findOne({
    where: {
      [Op.and]: [{ nama: nama }],
    },
  });
  if (custId === null) {
    return response.status(400).json({
      success: false,
      message: `User yang anda inputkan tidak ada`,
    });
  } else {
    //tanggal pemesanan sesuai tanggal hari ini + random string
    let date = moment();
    let tgl_pemesanan = date.format("YYYY-MM-DD");

    let tgl_check_in = request.body.tgl_check_in;
    let tgl_check_out = request.body.tgl_check_out;
    const date1 = moment(tgl_check_in);
    const date2 = moment(tgl_check_out);

    if (date2.isBefore(date1)) {
      return response.status(400).json({
        success: false,
        message: "masukkan tanggal yang benar",
      });
    }

    let tipe_kamar = request.body.tipe_kamar;

    let tipeRoomCheck = await tipe_kamarModel.findOne({
      where: {
        [Op.and]: [{ nama_tipe_kamar: tipe_kamar }],
      },
      attributes: [
        "id",
        "nama_tipe_kamar",
        "harga",
        "deskripsi",
        "foto",
        "createdAt",
        "updatedAt",
      ],
    });
    if (tipeRoomCheck === null) {
      return response.status(400).json({
        success: false,
        message: `Tidak ada tipe kamar dengan nama itu`,
      });
    }
    //mendapatkan kamar yang available di antara tanggal check in dan check out sesuai dengan tipe yang diinput user
    const result = await sequelize.query(
      `SELECT tipe_kamars.nama_tipe_kamar, kamars.nomor_kamar FROM kamars LEFT JOIN tipe_kamars ON kamars.tipeKamarId = tipe_kamars.id LEFT JOIN detail_pemesanans ON detail_pemesanans.kamarId = kamars.id WHERE kamars.id NOT IN (SELECT kamarId from detail_pemesanans WHERE tgl_akses BETWEEN '${tgl_check_in}' AND '${tgl_check_out}') AND tipe_kamars.nama_tipe_kamar ='${tipe_kamar}' GROUP BY kamars.nomor_kamar`
    );
    //cek apakah ada
    if (result[0].length === 0) {
      return response.status(400).json({
        success: false,
        message: `Kamar dengan tipe itu dan di tanggal itu sudah terbooking`,
      });
    }

    //masukkan nomor kamar ke dalam array
    const array = [];
    for (let index = 0; index < result[0].length; index++) {
      array.push(result[0][index].nomor_kamar);
    }

    //validasi agar input jumlah kamar tidak lebih dari kamar yang tersedia
    if (result[0].length < request.body.jumlah_kamar) {
      return response.status(400).json({
        success: false,
        message: `hanya ada ${result[0].length} kamar tersedia`,
      });
    }

    //mencari random index dengan jumlah sesuai input jumlah kamar
    let randomIndex = [];
    for (let index = 0; index < request.body.jumlah_kamar; index++) {
      randomIndex.push(Math.floor(Math.random() * array.length));
    }

    //isi data random elemnt dengan isi dari array dengan index random dari random index
    let randomElement = [];
    for (let index = 0; index < randomIndex.length; index++) {
      randomElement.push(Number(array[index]));
    }

    //isi roomId dengan data kamar hasil randoman
    let roomId = [];
    for (let index = 0; index < randomElement.length; index++) {
      roomId.push(
        await kamarModel.findOne({
          where: {
            [Op.and]: [{ nomor_kamar: randomElement[index] }],
          },
          attributes: [
            "id",
            "nomor_kamar",
            "tipeKamarId",
            "createdAt",
            "updatedAt",
          ],
        })
      );
    }

    //dapatkan harga dari id_tipe_kamar dikali dengan inputan jumlah kamar
    let roomPrice = 0;
    let cariTipe = await tipe_kamarModel.findOne({
      where: {
        [Op.and]: [{ id: roomId[0].tipeKamarId }],
      },
      attributes: [
        "id",
        "nama_tipe_kamar",
        "harga",
        "deskripsi",
        "foto",
        "createdAt",
        "updatedAt",
      ],
    });
    roomPrice = cariTipe.harga * request.body.jumlah_kamar;

    let newData = {
      nomor_pemesanan: request.body.nomor_pemesanan,
      nama_pemesan: request.body.nama_pemesan,
      email_pemesan: request.body.email_pemesan,
      tgl_pemesanan: tgl_pemesanan,
      tgl_check_in: request.body.tgl_check_in,
      tgl_check_out: request.body.tgl_check_out,
      nama_tamu: request.body.nama_tamu,
      jumlah_kamar: request.body.jumlah_kamar,
      tipeKamarId: cariTipe.id,
      status_pemesanan: "baru",
      userId: custId.id,
    };
    console.log(newData);

    //menetukan harga dengan cara mengali selisih tanggal check in dan check out dengan harga tipe kamar
    const startDate = moment(newData.tgl_check_in);
    const endDate = moment(newData.tgl_check_out);
    const duration = moment.duration(endDate.diff(startDate));
    const nights = duration.asDays();
    const harga = nights * roomPrice;

    //cek jika ada inputan kosong
    for (const [key, value] of Object.entries(newData)) {
      if (!value || value === "") {
        console.log(`Error: ${key} is empty`);
        return response
          .status(400)
          .json({ error: `${key} kosong mohon di isi ` });
      }
    }

    pemesananModel
      .create(newData)
      .then((result) => {
        let pemesananID = result.id;

        let tgl1 = new Date(result.tgl_check_in);
        let tgl2 = new Date(result.tgl_check_out);
        let checkIn = moment(tgl1).format("YYYY-MM-DD");
        let checkOut = moment(tgl2).format("YYYY-MM-DD");

        // check if the dates are valid
        let success = true;
        let message = "";

        // Create an array to store promises for detail creation
        let createDetailPromises = [];

        // Loop through dates and rooms to create details
        for (
          let m = moment(checkIn, "YYYY-MM-DD");
          m.isBefore(checkOut);
          m.add(1, "days")
        ) {
          let date = m.format("YYYY-MM-DD");

          // isi newDetail dengan id kamar hasil randomana lalu insert dengan di loop sesuai array yang berisi randoman kamar
          let newDetail = [];
          for (let index = 0; index < roomId.length; index++) {
            newDetail.push({
              pemesananId: pemesananID,
              kamarId: roomId[index].id,
              tgl_akses: date,
              harga: harga,
            });
          }

          // Create a promise for each detail creation and push it to the array
          createDetailPromises.push(
            Promise.all(
              newDetail.map((detail) => detailOfPemesananModel.create(detail))
            )
          );
        }

        // Wait for all detail creation promises to resolve
        Promise.all(createDetailPromises)
          .then(() => {
            // All details have been created successfully
            // You can now send the response
            return response.json({
              success: true,
              message: "New transactions have been inserted",
            });
          })
          .catch((error) => {
            return response.json({
              success: false,
              message: error.message,
            });
          });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  }
};

// UPDATE STATUS PEMESANAN
exports.updateStatusBooking = async (req, res) => {
  try {
    const params = { id: req.params.id };

    const result = await pemesananModel.findOne({ where: params });
    if (!result) {
      return res.status(404).json({
        message: "Data not found!",
      });
    }

    const data = {
      status_pemesanan: req.body.status_pemesanan,
    };

    if (data.status_pemesanan === "check_out") {
      await pemesananModel.update(data, { where: params });

      const updateTglAccess = {
        tgl_akses: null,
      };
      await detailOfPemesananModel.update(updateTglAccess, { where: params });
      return res.status(200).json({
        message: "Success update status booking to check out",
        code: 200,
      });
    }

    await pemesananModel.update(data, { where: params });
    return res.status(200).json({
      message: "Success update status booking",
      code: 200,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal error",
      err: err,
    });
  }
};
