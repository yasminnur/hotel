import React, { Component } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import LinesEllipsis from "react-lines-ellipsis";
import $ from "jquery";

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
        <div className="relative mx-6">
          <div className=" mt-6 right-10 -top-4">
            <div className="flex rounded w-full">
              <input
                type="text"
                className="w-full block px-4 py-2 bg-white border-2 border-black/25 rounded-full focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Search..."
                name="keyword"
                value={this.state.keyword}
                onChange={this.handleChange}
                onKeyUp={this._handleFilter}
              />
            </div>
          </div>

          {/* card */}
          <div className="font-[inter] flex flex-wrap mt-5">
            {this.state.typeroom.map((item, index) => {
              return (
                <div
                  className="relative mb-4 justify-start mx-3 text-gray-700 w-[335px] h-[430px] rounded-[15px]"
                  key={index}
                  onClick={() => this.handleDetail(item)}
                >
                  {/* GAMBAR Start */}

                  <div className="h-[300px] w-full mb-2 shadow-custom ">
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
                      <p className="text-[14px]">
                        <LinesEllipsis
                          text={item.deskripsi}
                          maxLine="1"
                          ellipsis="..."
                        />
                      </p>
                    </div>

                    <span className="absolute">
                      <div className="flex gap-x-[60px]">
                        <h1 className="text-[14px] font-extrabold text-slate-500">
                          IDR {item.harga}
                          <p className="font-regular inline px-1 text-xs">
                            /night
                          </p>
                        </h1>
                      </div>
                    </span>
                  </div>
                </div>
              );
            })}
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
                <div class="font-bold text-xl mb-5 text-[#354D51]">
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
