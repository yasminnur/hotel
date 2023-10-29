import React from "react";
import LinesEllipsis from "react-lines-ellipsis";
import Sidebar from "../Components/Sidebar";
import "../styles/typeroom.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import $ from "jquery";

export default class TypeRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      typeroom: [],
      id: "",
      nama_tipe_kamar: "",
      harga: "",
      deskripsi: "",
      foto: "",
      role: "",
      token: "",
      action: "",
      keyword: "",
      errors: "",
      selectedRoom: null,
    };

    if (localStorage.getItem("token")) {
      if (
        localStorage.getItem("role") === "admin" ||
        localStorage.getItem("role") === "resepsionis"
      ) {
        this.state.token = localStorage.getItem("token");
        this.state.role = localStorage.getItem("role");
      } else {
        window.alert("You're not admin or resepsionis!");
        window.location = "/";
      }
    }
  }

  headerConfig = () => {
    let header = {
      headers: { Authorization: `Bearer ${this.state.token}` },
    };
    return header;
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleFile = (e) => {
    this.setState({
      foto: e.target.files[0],
    });
  };

  handleCloseDetail = () => {
    $("#modal_detail").hide();
  };

  handleDetail = (item) => {
    $("#modal_detail").show();
    this.setState({
      id: item.id,
      nama_tipe_kamar: item.nama_tipe_kamar,
      harga: item.harga,
      deskripsi: item.deskripsi,
      foto: item.foto,
    });
  };

  handleClose = () => {
    $("#modal_typeroom").hide();
  };

  handleAdd = () => {
    $("#modal_typeroom").show();
    this.setState({
      showModal: true,
      id: "",
      nama_tipe_kamar: "",
      harga: "",
      deskripsi: "",
      foto: "",
      action: "insert",
    });
  };

  handleEdit = (item) => {
    $("#modal_typeroom").show();
    this.setState({
      showModal: true,
      id: item.id,
      nama_tipe_kamar: item.nama_tipe_kamar,
      harga: item.harga,
      deskripsi: item.deskripsi,
      foto: item.foto,
      action: "update",
    });
  };

  handleSave = (e) => {
    e.preventDefault();

    let form = new FormData();
    form.append("id", this.state.id);
    form.append("nama_tipe_kamar", this.state.nama_tipe_kamar);
    form.append("harga", this.state.harga);
    form.append("deskripsi", this.state.deskripsi);
    form.append("foto", this.state.foto);

    if (this.state.action === "insert") {
      let url = "http://localhost:4000/tipeKamar/add";
      axios
        .post(url, form, this.headerConfig())
        .then((response) => {
          if (response.data.code === 400) {
            return this.setState({ errors: response.data.message });
          }
          this.getTypeRoom();
          this.setState({
            id: "",
            nama_tipe_kamar: "",
            harga: "",
            deskripsi: "",
            foto: "",
          });
          this.handleClose();
        })
        .catch((error) => {
          console.log("error add data", error);
          if (error.response && (error.response.status === 500 || error.response.status === 404 || error.response.status === 400)) {
            window.alert(error.response.data.message);
          }
        });
        // .catch((error) => {
        //   console.log("error add data", error.response.status);
        //   if (error.response.status === 500) {
        //     window.alert("Failed to add data");
        //   }
        // });
    } else {
      let url = "http://localhost:4000/tipeKamar/update/" + this.state.id;
      axios
        .put(url, form, this.headerConfig())
        .then((response) => {
          if (response.data.message === `Validation error`) {
            window.alert("nama tipe kamar sudah digunakan");
          } else {
            alert("Success update data");
            this.getTypeRoom();
            this.handleClose();
          }
        })
        .catch((error) => {
          console.log("error add data", error);
          if (error.response && (error.response.status === 500 || error.response.status === 404 || error.response.status === 400)) {
            window.alert(error.response.data.message);
          }
        });
        // .catch((error) => {
        //   console.log(error);
        // });
    }
  };

  handleDrop = (id) => {
    let url = "http://localhost:4000/tipeKamar/delete/" + id;
    if (window.confirm("Are tou sure to delete this type room ? ")) {
      axios
        .delete(url, this.headerConfig())
        .then((response) => {
          console.log(response.data.message);
          window.location.reload();
        })
        .catch((error) => {
          if (error.response.status === 500) {
            window.alert("You can't delete this data");
          }
        });
    }
  };

  _handleFilter = () => {
    let data = {
      keyword: this.state.keyword,
    };
    let url = "http://localhost:4000/tipeKamar/find";
    axios
      .post(url, data, this.headerConfig())
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            typeroom: response.data.data,
          });
        } else {
          alert(response.data.message);
          this.setState({ message: response.data.message });
        }
      })
      .catch((error) => {
        console.log("error add data", error);
        if (error.response && (error.response.status === 500 || error.response.status === 404 || error.response.status === 400)) {
          window.alert(error.response.data.message);
        }
      });
  };

  getTypeRoom = () => {
    let url = "http://localhost:4000/tipeKamar/tipeKamar";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({
          typeroom: response.data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  checkRole = () => {
    if (this.state.role !== "admin" && this.state.role !== "resepsionis") {
      localStorage.clear();
      window.alert("You're not admin or resepsionis!");
      window.location = "/";
    }
  };

  componentDidMount() {
    this.getTypeRoom();
    this.checkRole();
  }

  render() {
    return (
      <div className="flex flex-row min-h-screen text-gray-800">
        <Sidebar />
        <main className="main flex flex-col flex-grow -ml-64 md:ml-64 transition-all duration-150 ease-in">
          <div className="main-content flex flex-col flex-grow p-4">
            <div className="mx-4 mb-5 mt-4">
              <h1 className="font-bold text-2xl uppercase text-gray-700">
                Type Room
              </h1>
            </div>
            <div className="mx-4 mb-2">
              <div className="flex items-center ">
                <div className="flex rounded w-full">
                  <input
                    type="text"
                    className="w-[540px] block px-4 py-2 bg-white border-2 border-black/25 rounded-full focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Search..."
                    name="keyword"
                    value={this.state.keyword}
                    onChange={this.handleChange}
                    onKeyUp={this._handleFilter}
                  />

                  {this.state.role === "admin" && (
                    <button
                      className="w-36 ml-5 px-4 font-regular bg-[#354D51]/50 text-black rounded-full hover:bg-blue-700"
                      onClick={() => this.handleAdd()}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* card */}
            <div className="font-[inter] flex flex-wrap justify-start">
              {this.state.typeroom.map((item, index) => {
                return (
                  <div
                    className="flex-inline rounded-lg shadow-lg h-82 w-[255px] m-4"
                    key={index}
                  >
                    <div className="" onClick={() => this.handleDetail(item)}>
                      <div className="mx-auto mt-3 w-[230px] h-[160px]">
                        <img
                          className="object-cover w-full h-full"
                          src={"http://localhost:4000/photo/" + item.foto}
                          alt=""
                        />
                      </div>
                      <div className=" w-[230px] mx-auto mb-3">
                        <div className="font-bold text-xl pt-2 text-black-700 uppercase">
                          {item.nama_tipe_kamar}
                        </div>
                        <p className="text-sm -mb-[0.5px] text-black-800 opacity-70">
                          <LinesEllipsis
                            text={item.deskripsi}
                            maxLine="1"
                            ellipsis="..."
                          />
                        </p>
                        <div className="pb-1 mb-2 text-lg text-black-700 font-normal">
                          Rp{item.harga}
                          <p className="font-regular inline px-1 text-xs">
                            /night
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mx-2 mb-2">
                      <button
                        className="bg-[#354D51] text-white font-[inter] p-1 w-20
                             focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={() => this.handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-700 text-white font-[inter] p-1 w-20
                             focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={() => this.handleDrop(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <footer className="footer px-4 py-2 ">
              <div className="footer-content ">
                <p className="text-sm text-gray-600 text-center ">
                  Copyright © 2023 Nyaman Hotel
                </p>
              </div>
            </footer>
          </div>
        </main>

        {/* Modal Form */}
        <div
          id="modal_typeroom"
          tabindex="-1"
          aria-hidden="true"
          className="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50"
        >
          <div className="flex lg:h-auto w-auto justify-center ">
            <div className="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={() => this.handleClose()}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Tutup modal</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-black">
                  Type Room
                </h3>
                <form
                  className="space-y-6"
                  onSubmit={(event) => this.handleSave(event)}
                >
                  <div>
                    <label
                      for="nama_tipe_kamar"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      Name Room Type
                    </label>
                    <input
                      type="text"
                      name="nama_tipe_kamar"
                      id="nama_tipe_kamar"
                      value={this.state.nama_tipe_kamar}
                      onChange={this.handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                      placeholder="Masukkan name room type"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="harga"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      Price Room Type
                    </label>
                    <input
                      type="number"
                      name="harga"
                      id="harga"
                      value={this.state.harga}
                      onChange={this.handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                      placeholder="Masukkan price room type"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="deskripsi"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      Description Room Type
                    </label>
                    <textarea
                      rows="3"
                      type="text"
                      name="deskripsi"
                      id="deskripsi"
                      value={this.state.deskripsi}
                      onChange={this.handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                      placeholder="Masukkan description room type"
                    />
                  </div>
                  <div>
                    <label
                      for="foto"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      Photo Room Type
                    </label>
                    <input
                      type="file"
                      name="foto"
                      id="foto"
                      placeholder="Pilih foto tipe kamar"
                      onChange={this.handleFile}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-800 focus:border-gray-800 block w-full px-2 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                      required={this.state.action === "update" ? false : true}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Simpan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* modal detail */}
        <div
          id="modal_detail"
          tabindex="-1"
          class="overflow-x-auto fixed top-0 left-0  right-0 z-50 hidden w-full py-8 px-16 md:inset-0 h-modal md:h-full  bg-black bg-opacity-50"
        >
          <div className="relative w-full  md:h-auto border-5 border-gray-500 rounded-lg shadow-2xl items-center">
            {/* <!-- Modal header --> */}
            <div class="flex px-5 py-1 h-[70px] items-center justify-between bg-slate-200 border-b rounded-t border-gray-500">
              <button
                type="button"
                class="text-gray-400 bg-transparent rounded-lg text-sm  ml-auto inline-flex items-center hover:bg-gray-600 hover:text-red-700"
                data-modal-hide="medium-modal"
                onClick={() => this.handleCloseDetail()}
              >
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <div class="flex p-6 h-[550px] bg-slate-100">
              <div className="w-1/2">
                <img
                  class="rounded-md p-2 w-full h-full "
                  src={"http://localhost:4000/photo/" + this.state.foto}
                  alt=""
                />
              </div>
              <div class=" w-1/2 px-6 pt-10 pb-5">
                <h3 class="font-bold text-2xl mb-2 uppercase">
                  {this.state.nama_tipe_kamar} room
                </h3>
                <div class="font-bold text-xl mb-5 text-blue-600">
                  {this.state.harga}/night
                </div>
                <p class="text-black-700 text-base">
                  {" "}
                  <span className="block">Deskripsi : </span>{" "}
                  {this.state.deskripsi}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
