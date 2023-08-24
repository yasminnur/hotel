const { request, response } = require("express");
const express = require("express");
const app = express();
const md5 = require("md5");
const userModel = require(`../models/index`).user;
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
      password: md5(request.body.password),
    };
    console.log(params.email);
    const findUser = await userModel.findOne({ where: params });
    if (findUser == null) {
      return response.status(404).json({
        message: "email or password doesn't match",
        // err: error,
      });
    }
    console.log(findUser);
    //generate jwt token
    let tokenPayLoad = {
      id: findUser.id,
      email: findUser.email,
      role: findUser.role,
    };
    tokenPayLoad = JSON.stringify(tokenPayLoad);
    let token = await jsonwebtoken.sign(tokenPayLoad, SECRET_KEY);

    return response.status(200).json({
      message: "Success login",
      data: {
        token: token,
        id: findUser.id,
        email: findUser.email,
        role: findUser.role,
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
  let user = await userModel.findAll();
  return response.json({
    success: true,
    data: user,
    message: `All User have been loaded`,
  });
};

//mendaptkan salah satu data dalam tabel (where clause)
exports.findUser = async (request, response) => {
  let keyword = request.body.keyword;

  let users = await userModel.findAll({
    where: {
      [Op.or]: [
        { nama_user: { [Op.substring]: keyword } },
        { email: { [Op.substring]: keyword } },
        { role: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    success: true,
    data: users,
    message: `User have been loaded`,
  });
};

//menambah data
exports.addUser = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    if (!request.file) {
      return response.json({ message: `Nothing to upload` });
    }

    let newUser = {
      nama_user: request.body.nama_user,
      foto: request.file.filename,
      email: request.body.email,
      password: md5(request.body.password),
      role: request.body.role,
    };

    userModel
      .create(newUser)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `New User has been inserted`,
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

//mengupdate salah satu data
exports.updateUser = async (request, response) => {
  upload(request, response, async (err) => {
    if (err) {
      return response.json({ message: err });
    }
    let id = request.params.id;
    let dataUser = {
      nama_user: request.body.nama_user,
      foto: request.file.filename,
      email: request.body.email,
      password: md5(request.body.password),
      role: request.body.role,
    };
    console.log(dataUser);

    if (request.file) {
      const selectedUser = await userModel.findOne({
        where: { id: id },
      });
      const oldFotoUser = selectedUser.foto;

      const pathImage = path.join(__dirname, `../photo`, oldFotoUser);
      if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, (error) => console.log(error));
      }
      dataUser.foto = request.file.filename;
    }
    userModel
      .update(dataUser, { where: { id: id } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data user has been updated`,
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

//mengahapus salah satu data
exports.deleteUser = async (request, response) => {
  let idUser = request.params.id;
  const user = await userModel.findOne({ wher: { id: idUser } });
  const oldFotoUser = user.foto;
  const patchFoto = path.join(__dirname, `../photo`, oldFotoUser);

  if (fs.existsSync(patchFoto)) {
    fs.unlink(patchFoto, (error) => console.log(error));
  }

  userModel
    .destroy({ where: { id: idUser } })

    .then((result) => {
      return response.json({
        success: true,
        message: `data user has ben delete where id_user :` + idUser,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
