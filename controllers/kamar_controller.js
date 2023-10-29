const kamarModel = require("../models/index").kamar;
const tipeKamarModel = require("../models/index").tipe_kamar;
const Op = require("sequelize").Op;
const Sequelize = require("sequelize");
const sequelize = new Sequelize("hotelbaru", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// GET ALL KAMAR
exports.getAllKamar = async (request, response) => {
  let kamars = await kamarModel.findAll({
    order: [["nomor_kamar", "DESC"]],
    include: {
      model: tipeKamarModel,
      attributes: ["nama_tipe_kamar"],
    },
  });
  return response.json({
    success: true,
    data: kamars,
    message: "All rooms have been loaded",
  });
};

// FIND KAMAR
exports.findKamar = async (request, response) => {
  let keyword = request.body.keyword;
  let kamars = await kamarModel.findAll({
    where: {
      [Op.or]: [{ nomor_kamar: { [Op.substring]: keyword } }],
    },
    include: {
      model: tipeKamarModel,
      attributes: ["nama_tipe_kamar"],
    },
  });

  return response.json({
    success: true,
    data: kamars,
    message: `All kamars have been loaded`,
  });
};

// ADD KAMAR
exports.addKamar = async (request, response) => {
  try {
    let tipeKamarId = request.body.tipeKamarId;
    let tipeId = await tipeKamarModel.findOne({
      where: {
        [Op.and]: [{ id: { [Op.substring]: tipeKamarId } }],
      },
    });
    if (!tipeId) {
      return response.json({
        success: false,
        message: `Tipe kamar yang Anda inputkan tidak ada`,
      });
    }
    
    let newRoom = {
      nomor_kamar: request.body.nomor_kamar,
      tipeKamarId: tipeId.id,
    };

    if (newRoom.nomor_kamar === "" || tipeKamarId === "") {
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
      return response.status(200).json({
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

// UPDATE KAMAR
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

// DELETE KAMAR
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

// AVAILABLE KAMAR
exports.getAvailable = async (request, response) => {
  const tgl_check_in = request.body.tgl_check_in;
  const tgl_check_out = request.body.tgl_check_out;

  const result = await sequelize.query(
    `SELECT DISTINCT tipe_kamars.* FROM tipe_kamars LEFT JOIN kamars ON tipe_kamars.id = kamars.tipeKamarId WHERE tipe_kamars.id IN (SELECT kamars.tipeKamarId FROM kamars LEFT JOIN tipe_kamars ON kamars.tipeKamarId = tipe_kamars.id LEFT JOIN detail_pemesanans ON detail_pemesanans.kamarId = kamars.id WHERE kamars.id NOT IN (SELECT kamarId from detail_pemesanans WHERE tgl_akses BETWEEN '${tgl_check_in}' AND '${tgl_check_out}') GROUP BY kamars.nomor_kamar);`
  );
  return response.json({
    success: true,
    sisa_kamar: result[0].length,
    data: result[0],
    message: `Room have been loaded`,
  });
};
