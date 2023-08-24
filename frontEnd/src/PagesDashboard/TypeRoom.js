import React from "react";
import LinesEllipsis from "react-lines-ellipsis";
import Sidebar from "../Components/Sidebar";
// import Header from "../Components/Header";
import "../styles/typeroom.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faTrash,
  // faPencilSquare,
  faPlus,
  // faSearch,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import $, { error } from "jquery";
// import { Fragment, useState } from 'react';
// import { Menu, Transition } from '@headlessui/react';
// import { ChevronDownIcon } from '@heroicons/react/solid';

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ')
// }

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
      dropdownId: null,
      dropdownRef: null,
      showModal: false,
      showDropdown : null,
      isDropdownOpen : false,
    selectedRoom: null,
    };

    this._handleKeyPress = this._handleKeyPress.bind(this);

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

  _handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      this._handleFilter();
    }
  };

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

  handleDropdown = (index) => {
    const { typeroom } = this.state;
    const updatedTyperoom = [...typeroom];
    updatedTyperoom[index].showDropdown = true;

    this.setState({
      typeroom: updatedTyperoom,
      selectedRoom: updatedTyperoom[index],
      isDropdownOpen: true,
    });
  };

  handleCloseDropdown = () => {
    const { typeroom } = this.state;
    const updatedTyperoom = typeroom.map((item) => ({
      ...item,
      showDropdown: false,
    }));
  
    this.setState({
      typeroom: updatedTyperoom,
      selectedRoom: null, // Clear the selected room
    });
  };
  
  handleClickOutsideDropdown = (event) => {
    if (
      this.state.selectedRoom &&
      !event.target.closest(".dropdown-container")
    ) {
      this.handleCloseDropdown();
    }
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutsideDropdown);
  }



  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutsideDropdown);
  }

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

  // handleEdit = (item) => {
  //   this.setState({
  //     showModal: true,
  //     id: item.id,
  //     nama_tipe_kamar: item.nama_tipe_kamar,
  //     harga: item.harga,
  //     deskripsi: item.deskripsi,
  //     foto: item.foto,
  //     action: "update",
  //   });
  //   console.log( "Handle Edit dijalankan");
  // };
  

// { this.state.showModal && (
//   <ModalTyperoom onClose={() => this.setState ({showModal: false})}
//     />
//   )
// }

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
          console.log("error add data", error.response.status);
          if (error.response.status === 500) {
            window.alert("Failed to add data");
          }
        });
    } else {
      let url = "http://localhost:4000/tipeKamar/update/" + this.state.id;
      axios
        .put(url, form, this.headerConfig())
        .then((response) => {
          if (response.data.success === false) {
            return this.setState({ errors: response.data.message });
          }
          this.getTypeRoom();
          this.handleClose();
          console.log(response);
          this.setState({ errors: "" });
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          this.setState({ error: error });
        });
    }
  };

  handleDrop = (id) => {
    let url = "http://localhost:4000/tipeKamar/delete/" + this.state.id;
    if (window.confirm("Are tou sure to delete this type room ? ")) {
      axios
        .delete(url, this.headerConfig())
        .then((response) => {
          console.log(response.data.message);
          this.getTypeRoom();
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
        console.log("error", error.response.status);
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

    const typeroomWithDropdown = this.state.typeroom.map(item => ({
      ...item,
      showDropdown: false,
    }));
  
    this.setState({
      typeroom: typeroomWithDropdown,
    });
  }

  render() {
    return (
      <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
        <Sidebar />
        <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
          <div className="main-content flex flex-col flex-grow p-4">
            <div className="hidden md:flex relative mb-4">
              <h1 className="font-bold text-2xl text-gray-700">Type Room</h1>
            </div>
            <div className="mb-4">
              <div className="flex items-center ">
                <div className="flex rounded w-full">
                  <input
                    type="text"
                    className="w-full block px-4 py-2 bg-white border-2 border-black/25 rounded-full focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Search..."
                    name="keyword"
                    value={this.state.keyword}
                    onChange={this.handleChange}
                    onKeyPress={this._handleKeyPress}
                  />

                  {this.state.role === "admin" && (
                    <button
                      className="w-36 ml-2 px-4 font-regular bg-[#354D51]/50 text-black rounded-full hover:bg-blue-700"
                      onClick={() => this.handleAdd()}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Add
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* card */}
            {/* <div className="flex shadow-lg h-48" onClick={() => this.handleDetail(item)}> */}
            <div className="sm:container mx-auto font-[inter] flex flex-wrap justify-start gap-2">
              {this.state.typeroom.map((item, index) => {
                console.log("ini item"+item)
                console.log("this typeroom" + this.state.typeroom);

                return (
                  <div className="flex shadow-lg h-48" key={index}>
                    {/* {" "} */}
                    {/* ukuran card */}
                    <img
                      className="object-cover w-40 h-full"
                      src={"http://localhost:4000/photo/" + item.foto}
                      alt=""
                    />
                    <div className="px-6 py-4 w-52 flex">
                      <div>
                        <div className="font-bold text-xl w-40  text-black-700 uppercase">
                          {item.nama_tipe_kamar}
                        </div>
                        <p className="text-sm -mb-[0.5px] text-black-800 opacity-70">
                          <LinesEllipsis
                            text={item.deskripsi}
                            maxLine="3"
                            ellipsis="..."
                          />
                        </p>
                        <div className="pb-1 mb-2 text-lg text-black-700 font-normal">
                          Rp{item.harga}
                          <p className="font-regular inline px-1 text-xs">
                            /night
                          </p>
                        </div>
                        {/* {this.state.showModal && (
        <ModalDetailKamar
          item={this.state.selectedRoom}
          onClose={() => this.setState({ showModal: false })}
        />
      )} */}
                        <div>
                          <button
                            className="w-[70px] bg-[#354D51] text-white font-[inter] p-1 w-1/2
                             focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => this.handleDetail(item)}
                          >
                            Detail
                          </button>
                        </div>
                      </div>
                      </div>

                      <div className="relative dropdown-container">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            this.handleDropdown(index)}}
                          className="focus:outline-none mr-4 mt-6"
                        >
                          <FontAwesomeIcon 
                            icon={faEllipsisVertical}
                            color="gray"
                          />
                        </button>

                        {/* dropdown */}
                        
                      {/* {item.showDropdown && ( */}
                         {/* {this.state.typeroom[index].showDropdown && ( */}
                        
                         {/* console.log("ini jugak item = "+item), */}
                         { this.state.isDropdownOpen && (
                          <div
                            className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg"
                            ref={(ref) => {
                              this.state.dropdownRef = ref;
                            }}
                          >
                        <ul className="p-0 list-none">
                          <li className="px-4 py-2 hover:bg-gray-100">
                            <button
                              type = "button"
                              onClick={(e) => {
                                e.stopPropagation(); // Ini akan mencegah event klik menyebar ke atas
                                this.handleEdit(item);
                              }}>
                        
                            Edit
                            </button>
                            </li>
                              <li className="px-4 py-2 hover:bg-gray-100">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Ini akan mencegah event klik menyebar ke atas
                                    this.handleDrop(item);
                                  }}
                                >
                                  Delete
                                </button>
                              </li>
                            </ul>
                        </div>
                        
                          )}    
                        {/* element to handle outside click */}
                      {/* {item.showDropdown && ( */}
                      {item.showDropdown && (
      <div
        className="fixed inset-0 z-10"
        onClick={this.handleCloseDropdown}
      />
    )}
                      </div>
                    </div>
                  
                );
              }
              )}
              </div>
              {/* </div> */}

            <footer className="footer px-4 py-2 ">
              <div className="footer-content ">
                <p className="text-sm text-gray-600 text-center ">
                  © 2023. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </main>

        {/* Modal Form */}
        {this.state.showModal && (
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
                  {this.state.action === "insert" ? "Add" : "Edit"} Type Room
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

                  {this.state.errors && <div>Error : {this.state.errors}</div>}

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
)}
        {/* modal detail */}
        <div
          id="modal_detail"
          tabindex="-1"
          className="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full pt-10 pb-10 pl-96 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50"
        >
          <div className="relative w-[900px] md:h-auto border-5 border-gray-500 rounded-lg shadow shadow-2xl items-center">
            <div className="relative bg-white rounded-lg">
              <div className="flex items-center justify-between p-3 border-b rounded-t border-gray-500 ">
                <h3 className="p-2 text-xl font-medium text-gray-900 ">
                  {this.state.nama_tipe_kamar} Room
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-red-500 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white"
                  data-modal-hide="medium-modal"
                  onClick={() => this.handleCloseDetail()}
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
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="h-[520px] w-[900px]">
                  <img
                    className="rounded-b-lg w-full h-[520px] cover"
                    src={"http://localhost:4000/" + this.state.foto}
                    alt=""
                  />
                <div className="px-2 py-4">
                  <div className="font-bold text-2xl mb-2">
                    {this.state.nama_tipe_kamar}
                  </div>
                  <div className="font-bold text-xl mb-2 text-blue-600">
                    {this.state.harga}/night
                  </div>
                  <p className="text-black-700 text-base">
                    {this.state.deskripsi}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
