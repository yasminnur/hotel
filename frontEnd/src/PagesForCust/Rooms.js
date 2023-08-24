import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import LinesEllipsis from "react-lines-ellipsis";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default class Rooms extends React.Component {
  constructor() {
    super();
    this.state = {
      typeroom: [],
      detail: [],
      tipeKamarId: "",
      nama_tipe_kamar: "",
      harga: "",
      deskripsi: "",
      foto: "",
      keyword: "",
    };
    this._handleKeyPress = this._handleKeyPress.bind(this);
  }
  _handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      this._handleFilter();
    }
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
  handleDetail = (item) => {
    $("#modal_detail").show();
    this.setState({
      //   tipeKamarId: item.tipeKamarId,
      id: item.id,
      nama_tipe_kamar: item.nama_tipe_kamar,
      harga: item.harga,
      deskripsi: item.deskripsi,
      foto: item.foto,
    });
  };

  handleClose = () => {
    $("#modal_detail").hide();
    };
    
  _handleFilter = () => {
    let data = {
      keyword: this.state.keyword,
    };
    let url = "http://localhost:4000/tipeKamar/find";
    axios
      .post(url, data)
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
      .get(url)
      .then((response) => {
        this.setState({
          typeroom: response.data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.getTypeRoom();
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className="relative m-6 pl-12">
          <p className="text-3xl font-bold mt-8">Room For You</p>
          <div className="absolute mt-6 right-10 -top-4">
            <div className="flex rounded w-[420px]">
              <input
                type="text"
                className="w-5/6 block w-full px-4 py-2 bg-white border rounded-full focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Search..."
                name="keyword"
                value={this.state.keyword}
                onChange={this.handleChange}
                onKeyPress={this._handleKeyPress}
              />
            </div>
          </div>

          {/* card */}
          {/* <div className="flex shadow-lg h-48" onClick={() => this.handleDetail(item)}> */}
          <div
            className="font-[inter] flex flex-wrap -ml-4 mt-5"
          >
            {this.state.typeroom.map((item, index) => {
              return (
                <div
                  className="relative mb-4 justify-start mx-3  relative text-gray-700 w-[240px] h-[300px] rounded-[15px]"
                      key={index}
            onClick={() => this.handleDetail(item)}
                >
                  {/* GAMBAR Start */}
                  <div className="h-[200px] w-[240px] mb-2 shadow-custom ">
                    <img
                      src={"http://localhost:4000/photo/" + item.foto}
                      alt=""
                      className="cover w-full h-full rounded-2xl "
                    />
                  </div>
                  {/* GAMBAR End */}

                  {/* DETAIL Start */}
                  <div className="pt-3 flex-col ">
                    <div className="flex flex-col ">
                      <h1 className="text-[16px] font-bold uppercase ">
                        {item.nama_tipe_kamar}
                      </h1>
                      {/* <p className="text-[14px]">
                          {item.deskripsi}
                        </p> */}
                    </div>

                    {/* HARGA + BUTTON CART Start */}
                    <span className="absolute">
                      <div className="flex gap-x-[60px]">
                        <h1 className="text-[14px] font-extrabold text-slate-500">
                          IDR {item.harga}
                          <p className="font-regular inline px-1 text-xs">
                            /night
                          </p>
                        </h1>

                        {/* Gunakan isSelected untuk menampilkan "qty" atau "Add to Cart" */}
                      </div>
                    </span>
                    {/* QTY End */}
                  </div>
                  {/* DETAIL End */}
                  <div className="absolute right-2 bottom-7 border-2 border-black w-[70px] h-[30px] rounded-lg">
                    <p className="text-black mx-2">booking</p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* </div> */}
        </div>

        {/* modal detail */}
        <div
          id="modal_detail"
          tabindex="-1"
          class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full pt-10 pb-10 pl-96 md:inset-0 h-modal md:h-full  bg-black bg-opacity-50"
        >
          <div className="relative w-[900px] md:h-auto border-5 border-gray-500 rounded-lg shadow shadow-2xl items-center">
            <div className="relative bg-white rounded-lg">
              {/* <!-- Modal header --> */}
              <div class="flex items-center justify-between p-5 border-b rounded-t border-gray-500">
                <h3 class="p-2 text-xl font-medium text-gray-900 ">
                  {this.state.nama_tipe_kamar}
                </h3>
                <button
                  type="button"
                  class="text-gray-400 bg-transparent hover:bg-red-500 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white"
                  data-modal-hide="medium-modal"
                  onClick={() => this.handleClose()}
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
              <div class="p-6">
                <div className="container">
                  <img
                    class="rounded-md w-200 h-100"
                    src={"http://localhost:4000/photo/" + this.state.foto}
                  />
                </div>
                <div class="px-2 py-4">
                  <div class="font-bold text-2xl mb-2">
                    {this.state.nama_tipe_kamar}
                  </div>
                  <div class="font-bold text-xl mb-2 text-blue-600">
                    {this.state.harga}/night
                  </div>
                  <p class="text-black-700 text-base">{this.state.deskripsi}</p>
                </div>
              </div>
              {/* <!-- Modal footer --> */}
              {/* <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button data-modal-hide="medium-modal" type="button" class="text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center " onClick={() => this.handleClose()}>Close</button>
                            </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
