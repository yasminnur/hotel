// (folder ini buat sendiri)
// require(`../models/index`).tipeKamar;
const { request, response } = require("express");
const tipeKamarModel = require("../models/index").tipe_kamar; //bagian .tipe_kamar ini ternyata harus sama kayak nama di models nya
// const userModel = require("../models/index").userModel;
const Op = require("sequelize").Op;
const path = require("path");
const upload = require(`./upload-photo`).single(`foto`);
const fs = require(`fs`);

exports.getAlltipeKamar = async (request, response) => {
  /** call findAll() to get all data */
  let tipeKamars = await tipeKamarModel.findAll();

  return response.json({
    success: true,
    data: tipeKamars,
    message: `All tipe Kamars have been loaded`,
  });
};

/** create function for filter */
exports.findTipeKamar = async (request, response) => {
  /** define keyword to find data */
  let keyword = request.body.keyword;

  /** call findAll() within where clause and operation
   * to find data based on keyword */
  let tipeKamars = await tipeKamarModel.findAll({
    where: {
      [Op.or]: [
        { nama_tipe_Kamar: { [Op.substring]: keyword } },
        { harga: { [Op.substring]: keyword } },
        { deskripsi: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    success: true,
    data: tipeKamars,
    message: `All tipe Kamars have been loaded`,
  });
};

/** create function for add new tipeKamar */
exports.addTipeKamar = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    if (!request.file) {
      return response.json({ message: `Nothing to Upload` });
    }

    let newTipeKamar = {
      nama_tipe_kamar: request.body.nama_tipe_kamar,
      harga: request.body.harga,
      deskripsi: request.body.deskripsi,
      foto: request.file.filename,
    };

    tipeKamarModel
      .create(newTipeKamar)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `tipe Kamar telah ditambahkan`,
        });
      })

      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

/** create function for update tipeKamar */
exports.updateTipeKamar = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    if (!request.file) {
      return response.json({
        message: `Nothing to Upload`,
      });
    }
    /** prepare data that has been changed */
    let id = request.params.id;
    let dataTipeKamar = {
      nama_tipe_kamar: request.body.nama_tipe_kamar,
      harga: request.body.harga,
      deskripsi: request.body.deskripsi,
      foto: request.file.filename,
    };

    if (request.file) {
      const selectedtipeKamar = await tipeKamarModel.findOne({
        where: { id: id },
      });
      const oldFototipeKamar = selectedtipeKamar.foto;

      const pathImage = path.join(__dirname, `../photo`, oldFototipeKamar);
      if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, (error) => console.log(error));
      }
      dataTipeKamar.foto = request.file.filename;
    }
    /** define id tipeKamar that will be update */
    // let id = request.params.id;

    /** execute update data based on defined id tipeKamar */
    tipeKamarModel
      .update(dataTipeKamar, { where: { id: id } })
      .then((result) => {
        /** if update's process success */
        return response.json({
          success: true,
          message: `Data tipe Kamar has been updated`,
        });
      })
      .catch((error) => {
        /** if update's process fail */
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

/** create function for delete data */
exports.deleteTipeKamar = (request, response) => {
  /** define id user that will be update */
  let idTipeKamar = request.params.id;

  /** execute delete data based on defined id user */
  tipeKamarModel
    .destroy({ where: { id: idTipeKamar } }) //id
    .then((result) => {
      /** if update's process success */
      return response.json({
        success: true,
        message: `Data tipe kamar has been deleted`,
      });
    })
    .catch((error) => {
      /** if update's process fail */
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

// /** create function for delete data */
// exports.deleteTipeKamar = (request, response) => {
//   /** define id tipeKamar that will be update */
//   let tipeKamarId = request.params.id;

//   /** execute delete data based on defined id tipeKamar */
//   tipeKamarModel.destroy({ where: { id: tipeKamarId } }) //id
//     .then((result) => {
//       /** if update's process success */
//       return response.json({
//         success: true,
//         message: `Data Tipe Kamar has been deleted`,
//       });
//     })
//     .catch((error) => {
//       /** if update's process fail */
//       return response.json({
//         success: false,
//         message: error.message,
//       });
//     });
// };
