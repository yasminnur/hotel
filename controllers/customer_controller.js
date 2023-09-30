const { request, response } = require("express");
const express = require("express");
const app = express();
const md5 = require("md5");
const customerModel = require(`../models/index`).customer;
const Op = require(`sequelize`).Op;
const path = require(`path`);
const fs = require(`fs`);
const upload = require(`./upload-photo`).single(`foto`);
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const jsonwebtoken = require("jsonwebtoken");
const SECRET_KEY = "secretcode";

exports.login = async (request, response) => {
  try {
    const params = {
      email: request.body.email,
      telepon: request.body.telepon,
    };
    console.log(params.email);
    const findCustomer = await customerModel.findOne({ where: params });
    if (findCustomer == null) {
      return response.status(404).json({
        message: "email or password doesn't match",
        // err: error,
      });
    }
    console.log(findCustomer);
    //generate jwt token
    let tokenPayLoad = {
      id: findCustomer.id,
      email: findCustomer.email,
      telepon: findCustomer.telepon,
    };
    tokenPayLoad = JSON.stringify(tokenPayLoad);
    let token = await jsonwebtoken.sign(tokenPayLoad, SECRET_KEY);

    return response.status(200).json({
      message: "Success login",
      data: {
        token: token,
        id: findCustomer.id,
        email: findCustomer.email,
        telepon: findCustomer.telepon,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "Internal error",
      err: error.message,
    });
  }
};

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
        { telepon: { [Op.substring]: keyword } },
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
      email: request.body.email,
      password: md5(request.body.password),
      telepon: request.body.telepon,
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
      email: request.body.email,
      password: md5(request.body.password),
      telepon: request.body.telepon,
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
