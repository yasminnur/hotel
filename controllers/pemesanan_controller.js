const { request, response } = require("express");
const detailOfPemesananModel = require(`../models/index`).detail_pemesanan;
const pemesananModel = require(`../models/index`).pemesanan;
const userModel = require(`../models/index`).user;
const kamarModel = require(`../models/index`).kamar;
const tipeKamarModel = require(`../models/index`).tipe_kamar;

const Op = require(`sequelize`).Op;
const Sequelize = require("sequelize");
const sequelize = new Sequelize("hotel2", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

exports.getPemesanan = async (request, response) => {
  const result = await pemesananModel.findAll({
    include: {
      model: tipeKamarModel,
      attributes: ["nama_tipe_kamar"],
    },
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
  let keyword = request.body.keyword;
  let pemesanans = await pemesananModel.findAll({
    where: {
      [Op.or]: [{ status_pemesanan: { [Op.substring]: keyword } }],
    },
  });
  return response.json({
    success: true,
    data: pemesanans,
    message: "All kamars have been loaded",
  });
};

exports.addPemesanan = async (request, response) => {
  let nomor_kamar = request.body.nomor_kamar;
  let kamar = await kamarModel.findOne({
    where: {
      [Op.and]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
    },
    attributes: ["id", "nomor_kamar", "tipeKamarId", "createdAt", "updatedAt"],
    include: [
      {
        model: tipeKamarModel,
        attributes: ["harga"],
      },
    ],
  });
  console.log("ini hasil let kamar"+kamar)

  let nama_user = request.body.nama_user;
  let userId = await userModel.findOne({
    where: {
      [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
    },
  });

  if (kamar === null) {
    return response.json({
      success: false,
      message: `Kamar yang anda inputkan tidak ada`,
    });
  } else if (userId === null) {
    return response.json({
      success: false,
      message: `User yang anda inputkan tidak ada`,
    });
  } else {
    let newData = {
      nomor_pemesanan: request.body.nomor_pemesanan,
      nama_pemesan: request.body.nama_pemesan,
      email_pemesan: request.body.email_pemesan,
      tgl_pemesanan: Date.now(),
      tgl_check_in: request.body.tgl_check_in,
      tgl_check_out: request.body.tgl_check_out,
      nama_tamu: request.body.nama_tamu,
      jumlah_kamar: 1, // Hanya satu jumlah kamar yang diizinkan
      tipeKamarId: kamar.tipeKamarId,
      status_pemesanan: request.body.status,
      userId: userId.id,
    };
    console.log(newData);
    let kamarCheck = await sequelize.query(
      `SELECT * FROM detail_pemesanans WHERE kamarId = ${kamar.id} AND tgl_akses >= "${request.body.check_in}" AND tgl_akses <= "${request.body.check_out}" ;`
    );

    if (kamarCheck[0].length === 0) {
      const tglCheckIn = new Date(request.body.check_in);
      const tglCheckOut = new Date(request.body.check_out);
      const diffTime = Math.abs(tglCheckOut - tglCheckIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      pemesananModel
        .create(newData)
        .then((result) => {
          let pemesananID = result.id;
          // let detailsOfPemesanan = request.body.details_of_pemesanan;
          let detailData = [];

          for (let i = 0; i <= diffDays; i++) {
            let newDetail = {
              pemesananId: pemesananID,
              kamarId: kamar.id,
              tgl_akses: new Date(
                tglCheckIn.getTime() + i * 24 * 60 * 60 * 1000
              ),
              harga: kamar.tipe_kamar.harga,
            };
            detailData.push(newDetail);
          }

          detailOfPemesananModel
            .bulkCreate(detailData)
            .then((result) => {
              return response.json({
                success: true,
                message: `New transaction has been inserted`,
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
    } else {
      return response.json({
        success: false,
        message: `Kamar yang anda pesan sudah di booking`,
      });
    }
  }
};

exports.updatePemesanan = async (request, response) => {
  let id = request.params.id;
  let pemesanan = {
    nomor_pemesanan: request.body.nomor_pemesanan,
    nama_pemesan: request.body.nama_pemesan,
    email_pemesan: request.body.email_pemesan,
    tgl_pemesanan: request.body.tgl_pemesanan,
    tgl_check_in: request.body.tgl_check_in,
    tgl_check_out: request.body.tgl_check_out,
    nama_tamu: request.body.nama_tamu,
    jumlah_kamar: request.body.jumlah_kamar,
    tipeKamarId: request.body.tipeKamarId,
    status_pemesanan: request.body.status_pemesanan,
    userId: request.body.userId,
  };
  pemesananModel
    .update(pemesanan, { where: { id: id } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data terupdate`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: "gabisa",
      });
    });
};

exports.deletePemesanan = async (request, response) => {
  let id = request.params.id;

  pemesananModel
    .destroy({ where: { id: id } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data tipe pemesanan has been deleted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
