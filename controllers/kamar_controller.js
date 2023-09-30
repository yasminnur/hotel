// (folder ini buat sendiri)
// require(`../models/index`).kamar;
const { request, response } = require("express");
const kamarModel = require("../models/index").kamar;
const tipeKamarModel = require("../models/index").tipe_kamar;
const Op = require("sequelize").Op;

exports.getAllKamar = async (request, response) => {
  let kamars = await kamarModel.findAll({
    include: {
      model: tipeKamarModel,
      attributes: ['nama_tipe_kamar']
    }
  });
  return response.json({
    success: true,
    data: kamars,
    message: "All rooms have been loaded",
  });
};

/** create function for filter */
exports.findKamar = async (request, response) => {
  let keyword = request.body.keyword;
  let kamars = await kamarModel.findAll({
    where: {
      [Op.or]: [
        { nomor_kamar: { [Op.substring]: keyword } },
        { tipeKamarID: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    success: true,
    data: kamars,
    message: `All kamars have been loaded`,
  });
};

/** create function for add new kamar */
// Metode untuk menambahkan kamar baru
exports.addKamar = async (request, response) => {
  try {
    let tipeKamarId = request.body.tipeKamarId;
    console.log("nama tipe kamar = " + tipeKamarId)
  let tipeId = await tipeKamarModel.findOne({
    where: {
      [Op.and]: [{ nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }],
    },
    attributes: ["id", "nama_tipe_kamar", "createdAt", "updatedAt"],
  });
  console.log("ini hasil let kamar woi"+tipeId)
    if (!tipeId) {
      console.log("kosong??")
      return response.json({
        success: false,
        message: `Tipe kamar yang Anda inputkan tidak ada`,
      });
    }
    console.log("ini = "+tipeId)
    console.log("sampai sini 2")
    let newRoom = {
      nomor_kamar: request.body.nomor_kamar,
      tipeKamarId: tipeId.id,
    };
    console.log("tipe kamar id = "+newRoom.tipeKamarId)
  
    if (newRoom.nomor_kamar === "" || nama_tipe_kamar === "") {
      return response.json({
        success: false,
        message: `Mohon diisi semua`,
      });
    }
  
    let kamars = await kamarModel.findAll({
      where: {
        [Op.and]: [
          { nomor_kamar: newRoom.nomor_kamar },
          { tipeKamarId: newRoom.tipeKamarId },
        ],
      },
      attributes: ["id", "nomor_kamar", "tipeKamarId"],
    });
  
    if (kamars.length > 0) {
      return response.json({
        success: false,
        message: `Kamar yang Anda inputkan sudah ada`,
      });
    }
  
    kamarModel
      .create(newRoom)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `New Room has been inserted`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
  
};

exports.updateKamar = async (request, response) => {
  let dataKamar = {
    nomor_kamar: request.body.nomor_kamar,
    tipeKamarId: request.body.tipeKamarId,
  };
  let id = request.params.id;
  kamarModel
    .update(dataKamar, { where: { id: id } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data room has been updated`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

// alyak
// exports.updateKamar = async (request, response) => {
//   let dataKamar = {
//     nomor_kamar: request.body.nomor_kamar,
//     tipeKamarId: request.body.tipeKamarId,
//   };
//   let id = request.params.id;
//   kamarModel
//     .update(dataKamar, { where: { id: id } })
//     .then((result) => {
//       return response.json({
//         success: true,
//         message: `Data room has been updated`,
//       });
//     })
//     .catch((error) => {
//       return response.json({
//         success: false,
//         message: error.message,
//       });
//     });
// };

exports.deleteKamar = (request, response) => {
  let id = request.params.id;
  kamarModel
    .destroy({ where: { id: id } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data room has been deleted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
exports.availableRoom = async (request, response) => {
  const tgl_akses_satu = request.body.tgl_akses_satu;
  const tgl_akses_dua = request.body.tgl_akses_dua;

  const result = await sequelize.query(
    `SELECT tipe_kamars.nama_tipe_kamar, kamars.nomor_kamar FROM kamars LEFT JOIN tipe_kamars ON kamars.tipeKamarId = tipe_kamars.id LEFT JOIN detail_pemesanans ON detail_pemesanans.kamarId = kamars.id WHERE kamars.id NOT IN (SELECT kamarId from detail_pemesanans WHERE tgl_akses BETWEEN '${tgl_akses_satu}' AND '${tgl_akses_dua}')`
  );

  return response.json({
    success: true,
    sisa_kamar: result[0].length,
    data: result[0],
    message: `Room have been loaded`,
  });
};
