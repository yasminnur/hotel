// (folder ini buat sendiri)
// require(`../models/index`).detailPemesanan;
const { request, response } = require("express")
const detailPemesananModel = require("../models/index").detailPemesanan
const Op = require('sequelize').Op
const path  = require("path")
const upload = require(`./upload-photo`).single(`foto`)
const md5 = require(`md5`)

exports.getAlldetailPemesanan = async (request, response) => {
  /** call findAll() to get all data */
  let detailPemesanans = await detailPemesananModel.findAll();
  return response.json({
    success: true,
    data: detailPemesanans,
    message: `All detailPemesanans have been loaded`,
  });
};

/** create function for filter */
exports.finddetailPemesanan = async (request, response) => {
  /** define keyword to find data */
  let keyword = request.body.keyword;

  /** call findAll() within where clause and operation
   * to find data based on keyword */
  let detailPemesanans = await detailPemesananModel.findAll({
    where: {
      [Op.or]: [
        { nama_detailPemesanan: { [Op.substring]: keyword } },
        { foto: { [Op.substring]: keyword } },
        { email: { [Op.substring]: keyword } },
        { role: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    success: true,
    data: detailPemesanans,
    message: `All detailPemesanans have been loaded`,
  })
}



/** create function for add new detailPemesanan */
exports.adddetailPemesanan = (request, response) => {
  upload(request, response, async error => {
      if (error) {
          return response.json({ message: error })
      }
      
      if (!request.file) {
          return response.json({ message: `Nothing to Upload`
      })
  }
  
  let newdetailPemesanan = {
      nama_detailPemesanan: request.body.nama_detailPemesanan,
      foto: request.file.filename,
      email: request.body.email,
      password: md5(request.body.password),
      role: request.body.role,
  }
  
  detailPemesananModel.create(newdetailPemesanan).then(result => {
      return response.json({
          success: true,
          data: result,
          message: `detailPemesanan telah ditambahkan`
      })
  })
  
  .catch(error => {
      return response.json({
          success: false,
          message: error.message
      })
  })
})
}


/** create function for update detailPemesanan */
exports.updatedetailPemesanan = (request, response) => {
  /** prepare data that has been changed */
  let datadetailPemesanan = {
    nama_detailPemesanan: request.body.nama_detailPemesanan,
    foto: request.body.foto,
    email: request.body.email,
     password: request.body.password,
     role: request.body.role,
  };

  /** define id detailPemesanan that will be update */
  let iddetailPemesanan = request.params.id;

  /** execute update data based on defined id detailPemesanan */
  detailPemesananModel.update(datadetailPemesanan, { where: { id: iddetailPemesanan } })
    .then((result) => {
      /** if update's process success */
      return response.json({
        success: true,
        message: `Data detailPemesanan has been updated`,
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

// /** create function for update detailPemesanan */
// exports.updatedetailPemesanan = (request, response) => {
//   /** prepare data that has been changed */
//   let datadetailPemesanan = {
//     nama_detailPemesanan: request.body.nama_detailPemesanan,
//     foto: request.body.foto,
//     email: request.body.email,
//     password: request.body.password,
//     role: request.body.role,
//   };

//   /** define id detailPemesanan that will be update */
//   let iddetailPemesanan = request.params.id;

//   /** execute update data based on defined id detailPemesanan */
//   detailPemesananModel.update(datadetailPemesanan, { where: { id: iddetailPemesanan } }) //
//     .then((result) => {
//       /** if update's process success */
//       return response.json({
//         success: true,
//         message: `Data detailPemesanan has been updated`,
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
/** create function for delete data */
exports.deletedetailPemesanan = (request, response) => {
  /** define id detailPemesanan that will be update */
  let iddetailPemesanan = request.params.id;

  /** execute delete data based on defined id detailPemesanan */
  detailPemesananModel.destroy({ where: { id: iddetailPemesanan } }) //id
    .then((result) => {
      /** if update's process success */
      return response.json({
        success: true,
        message: `Data detailPemesananan has been deleted`,
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
