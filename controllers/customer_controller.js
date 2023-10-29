const express = require("express");
const app = express();
const md5 = require("md5");
const customerModel = require(`../models/index`).customer;
const Op = require(`sequelize`).Op;
const upload = require(`./upload-photo`).single(`foto`);
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const jsonwebtoken = require("jsonwebtoken");
const SECRET_KEY = "secretcode"; 

//menambah data
exports.register = async (request, response) => {
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
};

exports.login = async (request, response) => {
  try {
    const params = {
      email: request.body.email,
      password: md5(request.body.password),
    };
    const findCustomer = await customerModel.findOne({ where: params });
    if (findCustomer == null) {
      return response.status(404).json({
        message: "email or password doesn't match",
      });
    }

    //generate jwt token
    let tokenPayLoad = {
      id: findCustomer.id,
      nama: findCustomer.nama,
      email: findCustomer.email,
      telepon: findCustomer.telepon,
      role: "customer",
    };
    tokenPayLoad = JSON.stringify(tokenPayLoad);
    let token = await jsonwebtoken.sign(tokenPayLoad, SECRET_KEY);

    return response.status(200).json({
      message: "Success login",
      data: {
        token: token,
        id: findCustomer.id,
        nama: findCustomer.nama,
        email: findCustomer.email,
        telepon: findCustomer.telepon,
        role: "customer",
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

