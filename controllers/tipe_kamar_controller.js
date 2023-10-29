const tipeKamarModel = require("../models/index").tipe_kamar;
const Op = require("sequelize").Op;
const path = require("path");
const upload = require(`./upload-photo`).single(`foto`);
const fs = require(`fs`);

// GET ALL TIPE KAMAR
exports.getAlltipeKamar = async (request, response) => {
  let tipeKamars = await tipeKamarModel.findAll({
    order: [["createdAt", "DESC"]],
  });

  return response.json({
    success: true,
    data: tipeKamars,
    message: `All tipe Kamars have been loaded`,
  });
};

// FIND TIPE KAMAR
exports.findTipeKamar = async (request, response) => {
  let keyword = request.body.keyword;

  let tipeKamars = await tipeKamarModel.findAll({
    where: {
      [Op.or]: [
        { nama_tipe_Kamar: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    success: true,
    data: tipeKamars,
    message: `All tipe Kamars have been loaded`,
  });
};

// ADD TIPE KAMAR
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

// UPDATE TIPE KAMAR
exports.updateTipeKamar = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    let idType = request.params.id;

    let dataType = {
      nama_tipe_kamar: request.body.nama_tipe_kamar,
      harga: request.body.harga,
      deskripsi: request.body.deskripsi,
    };
    if (request.file && request.file.filename) {
      dataType.foto = request.file.filename;
    }

    if (request.file) {
      const selectedUser = await tipeKamarModel.findOne({
        where: { id: idType },
      });

      const oldFotoUser = selectedUser.foto;

      const patchFoto = path.join(__dirname, `../photo`, oldFotoUser);

      if (fs.existsSync(patchFoto)) {
        fs.unlink(patchFoto, (error) => console.log(error));
      }
      dataType.foto = request.file.filename;
    }

    tipeKamarModel
      .update(dataType, { where: { id: idType } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data room type has been update`,
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

// DELETE TIPE KAMAR
exports.deleteTipeKamar = (request, response) => {
  let idTipeKamar = request.params.id;

  tipeKamarModel
    .destroy({ where: { id: idTipeKamar } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data tipe kamar has been deleted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
