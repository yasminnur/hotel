const { request, response } = require("express");
const express = require("express");
const app = express();
const customerModel = require(`../models/index`).customer;
const Op = require(`sequelize`).Op;
const path = require(`path`);
const fs = require(`fs`);
// const upload = require(`./upload-photo`).single(`foto`);
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mendaptkan semua data dalam tabel
exports.getAll = async (request, response) => {
  let Customer = await customerModel.findAll();
  return response.json({
    success: true,
    data: Customer,
    message: `All Customer have been loaded`,
  });
};

//mendaptkan salah satu data dalam tabel (where clause)
exports.findCustomer = async (request, response) => {
  let keyword = request.body.keyword;

  let Customers = await customerModel.findAll({
    where: {
      [Op.or]: [
        { nama: { [Op.substring]: keyword } },
        { email: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    success: true,
    data: Customers,
    message: `Customer have been loaded`,
  });
};

//menambah data
exports.addCustomer = (request, response) => {
    let newCustomer = {
      nama: request.body.nama,
      // foto: request.file.filename,
      email: request.body.email,
      password: request.body.password,
    };

    customerModel
      .create(newCustomer)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `New Customer has been inserted`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  }

//mengupdate salah satu data
exports.updateCustomer = async (request, response) => {
  let id = request.params.id;
    let dataCustomer = {
      nama: request.body.nama,
      // foto: request.file.filename,
      email: request.body.email,
      password: request.body.password,
    };
    console.log(dataCustomer);
    customerModel
      .update(dataCustomer, { where: { id: id } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data Customer has been updated`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  }

//mengahapus salah satu data
exports.deleteCustomer = async (request, response) => {
  let idCustomer = request.params.id;

  customerModel
    .destroy({ where: { id: idCustomer } })

    .then((result) => {
      return response.json({
        success: true,
        message: `data Customer has ben delete where id_Customer :` + idCustomer,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
