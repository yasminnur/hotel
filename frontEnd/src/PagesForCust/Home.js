import React from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import LinesEllipsis from "react-lines-ellipsis";

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      tipe: [],
      kamar: [],
      booking: [],
      tipe_kamar: [],
      user: [],
      type: "",
      nama_tipe_kamar: "",
      harga: "",
      emai: "",
      deskripsi: "",
      foto: "",
      nama: "",
      nomor_pemesanan: "",
      tgl_pemesanan: "",
      tgl_check_in: "",
      tgl_check_out: "",
      nama_pemesan: "",
      nama_tamu: "",
      email_pemesan: "",
      jumlah_kamar: "",
      role: "",
      token: "",
      avail: [],
      action: "",
      isLogin: false,
    };

    this.state.id_customer = localStorage.getItem("id");
    this.state.token = localStorage.getItem("token");
    this.state.nama = localStorage.getItem("nama");
  }

  headerConfig = () => {
    let header = {
      headers: { Authorization: `Bearer ${this.state.token}` },
    };
    return header;
  };

  handleChange = (e) => {
    console.log("Selected value:", e.target.value);
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleClose = () => {
    $("#modal_detail").hide();
  };

  handleDetail = (item) => {
    $("#modal_detail").show();
    this.setState({
      id_room_type: item.id,
      nama_tipe_kamar: item.nama_tipe_kamar,
      harga: item.harga,
      deskripsi: item.deskripsi,
      foto: item.foto,
    });
  };

  handleCloseBooking = () => {
    $("#modal_booking").hide();
  };

  showModal = () => {
    $("#modal_booking").show();
    this.setState({
      nomor_pemesanan: "",
      nama_pemesan: "",
      email_pemesan: "",
      nama: "",
      tipe_kamar: "",
      tgl_check_in: "",
      tgl_check_out: "",
      nama_tamu: "",
      jumlah_kamar: 1,
      action: "insert",
      nomor_pemesanan: Math.floor(Math.random() * 90000) + 10000,
    });
  };
  handleAddBooking = (e) => {
    e.preventDefault();
    let form = {
      nama_pemesan: localStorage.getItem("nama"),
      email_pemesan: localStorage.getItem("email"),
      // nama: localStorage.getItem("nama"),
      tipe_kamar: this.state.type,
      tgl_check_in: this.state.tgl_check_in,
      tgl_check_out: this.state.tgl_check_out,
      nama_tamu: this.state.nama_tamu,
      jumlah_kamar: this.state.jumlah_kamar,
      nomor_pemesanan: this.state.nomor_pemesanan,
    };
    console.log(form);
    let url = "http://localhost:4000/pemesanan/add";
    axios
      .post(url, form, this.headerConfig())
      .then((response) => {
        window.alert("Succes transaction");
        window.location = "/mybookings";
      })
      .catch((error) => {
        console.log("error add data", error);
        if (error.response && (error.response.status === 500 || error.response.status === 404 || error.response.status === 400)) {
          window.alert(error.response.data.message);
        }
      });
  }

  handleFilter = (e) => {
    e.preventDefault();
    let data = {
      tgl_check_in: this.state.tgl_check_in,
      tgl_check_out: this.state.tgl_check_out,
    };

    let url = "http://localhost:4000/kamar/available";
    axios
      .post(url, data)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            avail: response.data.data,
          });
          console.log(response.data.data);
        } else {
          alert(response.data.message);
          this.setState({ message: response.data.message });
        }
      })
      .catch((error) => {
        console.log("error add data", error);
        if (
          error.response &&
          (error.response.status === 500 ||
            error.response.status === 404 ||
            error.response.status === 400)
        ) {
          window.alert(error.response.data.message);
        }
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { tgl_check_in, tgl_check_out } = this.state; // Mengambil nilai dari state

    let form = new FormData();
    form.append("tgl_check_in", tgl_check_in);
    form.append("tgl_check_out", tgl_check_out);

    // Simpan tgl_check_in dan tgl_check_out ke dalam localStorage
    localStorage.setItem("tgl_check_in", tgl_check_in);
    localStorage.setItem("tgl_check_out", tgl_check_out);
  };
  handleCheckInChange = (e) => {
    this.setState({
      tgl_check_in: e.target.value,
    });
    if (this.state.tgl_check_out) {
      this.handleFilter();
    }
  };

  handleCheckOutChange = (e) => {
    this.setState({
      tgl_check_out: e.target.value,
    });
    if (this.state.tgl_check_in) {
      this.handleFilter();
    }
  };

  getBooking = () => {
    let url = "http://localhost:4000/pemesanan/pemesanan";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({
          kamar: response.data.data,
        });
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getTypeRoom = () => {
    let url = "http://localhost:4000/tipeKamar/tipeKamar";
    axios
      .get(url)
      .then((response) => {
        this.setState({
          tipe: response.data.data,
        });
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getUser = () => {
    let url = "http://localhost:4000/user/role/resepsionis";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({
          user: response.data.data,
        });
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  showAlertMustLogin = () => {
    window.alert("You must Register or Login as Customer");
    window.location = "/logincust";
  };

  componentDidMount() {
    this.getBooking();
    this.getTypeRoom();
    this.getUser();
    if (this.state.token) {
      this.setState({
        isLogin: true,
      });
    }
  }

  render() {
    return (
      <div>
        <div name="home" className=" flex flex-col justify-between pb-4 ">
          <Navbar />

          <section class="pt-4 pb-2">
            <div
              className="relative grid md:grid-cols-2 w-[1450px] h-[800px] m-auto mt-20 rounded-xl"
              style={{
                backgroundImage: 'url("/assets/bangunanhotel.jpg")',
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center bottom",
                width: "1450px", 
                height: "800px", 
              }}
            >
              <div className="relative h-[800px] w-[1450px] bg-gradient-to-r from-[#354D51] rounded-xl">
                <div className="flex flex-col justify-start w-full pl-12 py-32">
                  <p className="py-3 text-5xl md:text-5xl font-bold text-slate-100">
                    Find <span className="text-blue-600">Comfortable</span> Room
                  </p>
                  <p className="text-5xl md:text-5xl font-bold mb-8 text-slate-100">
                    With Nyaman.
                  </p>
                  <p className="text-md mr-12 mb-4 text-slate-200">
                    There are many variations of passages of Lorem Ipsum
                    available, <br />
                    but the majority have suffered alteration in some form, by{" "}
                    <br />
                    injected humour,or randomised but the majority have suffered{" "}
                    <br />
                    alteration{" "}
                  </p>
                  {this.state.isLogin ? (
                    <button
                      className="z-50 py-2 px-1 w-[25%] my-4 text-[#354D51] bg-slate-100 border-[#354D51] rounded-md text-lg font-semibold hover:bg-slate-200 hover:text-[#354D51]"
                      onClick={() => this.showModal()}
                    >
                      Booking Now
                    </button>
                  ) : (
                    <button
                      className="z-50 py-2 px-1 w-[25%] my-4 text-[#354D51] bg-slate-100 border-[#354D51] rounded-md text-lg font-semibold hover:bg-[#50757b]"
                      onClick={() => this.showAlertMustLogin()}
                    >
                      Booking Now
                    </button>
                  )}
                </div>
              </div>

              <div class="absolute left-[200px] -bottom-[50px] ">
                <div class="flex mx-auto bg-slate-100 px-16 py-4 border-2 border-grey shadow h-[150px] rounded-xl w-[1000px]">
                  <form onSubmit={(e) => this.handleFilter(e)}>
                    <div class="flex flex-row ml-11 -mt-14">
                      <div className="pr-10 pl-10 pt-5 pb-6">
                        <div class="flex items-center">
                          <div className="mr-3 bg-[#354D51] p-4 rounded-md h-auto">
                            <FontAwesomeIcon
                              icon={faCalendar}
                              size="2x"
                              color="white"
                            />
                          </div>
                          <div>
                            <h3 className="mb-1 font-bold">Check-In Date</h3>
                            <input
                              type="date"
                              name="tgl_check_in"
                              id="tgl_check_in"
                              className="border-2 border-[#9BA4B5] rounded-md p-1"
                              value={this.state.tgl_check_in}
                              onChange={this.handleCheckInChange}
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="pr-10 pl-4 pt-5 pb-6 ml-16">
                        <div class="flex items-center">
                          <div className="mr-3 bg-[#354D51] p-4 rounded-md h-auto">
                            <FontAwesomeIcon
                              icon={faCalendar}
                              size="2x"
                              color="white"
                            />
                          </div>
                          <div>
                            <h3 className="mb-1 font-bold">Check-Out Date</h3>
                            <input
                              type="date"
                              name="tgl_check_out"
                              id="tgl_check_out"
                              className="border-2 border-[#9BA4B5] rounded-md p-1"
                              value={this.state.tgl_check_out}
                              onChange={this.handleCheckOutChange}
                              min={this.state.tgl_check_out}
                            />
                          </div>
                          <button
                            class="w-full px-5 py-2 mt-4 text-sm ml-16 font-medium text-white capitalize transition-colors duration-300 transform bg-[#354D51]/50 rounded-md lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
                            type="submit"
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* ini buat available room */}
          {this.state.avail?.length > 0 && (
            <section class="bg-gray-100">
              <div className="m-6 pl-24">
                <p className="text-5xl font-bold mt-20">
                  <span className="text-blue-600">Available</span> Room{" "}
                </p>

                <div class="grid grid-cols-3 mt-8">
                  {this.state.tgl_check_out == "" &&
                  this.state.tgl_check_out == ""
                    ? ""
                    : this.state.avail?.map((item, index) => (
                        <div class="col-span-1">
                          {/* Card untuk type room */}
                          <div className="CardEvent" key={index}>
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
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </section>
          )}

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

          {/* Modal Form */}
          <div
            id="modal_booking"
            tabindex="-1"
            class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full pt-4 pl-[600px] md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50"
          >
            <div class="relative w-full h-full max-w-lg md:h-auto border-2 border-gray-500 rounded-lg shadow  items-center">
              <div class="relative bg-white rounded-lg">
                <div class="flex items-center justify-between p-5 border-b rounded-t border-gray-500">
                  <h3 class="p-2 text-xl font-medium text-gray-900 ">
                    Add Booking Room
                  </h3>
                  <button
                    type="button"
                    class="text-gray-400 bg-transparent hover:bg-red-500 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white"
                    data-modal-hide="medium-modal"
                    onClick={() => this.handleCloseBooking()}
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
                <div class="p-2">
                  <div class="px-8 py-2 ">
                    <form
                      class="space-y-6"
                      onSubmit={(event) => this.handleAddBooking(event)}
                    >
                      <div>
                        <label
                          for="nama_tamu"
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                        >
                          Guest Name
                        </label>
                        <input
                          type="text"
                          name="nama_tamu"
                          id="nama_tamu"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                          placeholder="Name for guest"
                          value={this.state.nama_tamu}
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label
                          for="jumlah_kamar"
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                        >
                          Total Room{" "}
                        </label>
                        <input
                          type="number"
                          name="jumlah_kamar"
                          id="jumlah_kamar"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                          placeholder="Total room your booked"
                          value={this.state.jumlah_kamar}
                          onChange={this.handleChange}
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <label
                          for="type"
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                        >
                          Room Type
                        </label>

                        <select
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                          placeholder="Jenis Room Type"
                          name="type"
                          value={this.state.type}
                          onChange={this.handleChange}
                          required
                        >
                          <option value="">Choose Room Type</option>
                          {this.state.tipe &&
                            this.state.tipe.map((item, index) => (
                              <option key={index} value={item.nama_tipe_kamar}>
                                {item.nama_tipe_kamar}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label
                          for="tgl_check_in"
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                        >
                          Check-In Date
                        </label>
                        <input
                          type="date"
                          name="tgl_check_in"
                          id="tgl_check_in"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                          placeholder="Choose check in date"
                          value={this.state.tgl_check_in}
                          onChange={this.handleChange}
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                      <div>
                        <label
                          for="tgl_check_out"
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                        >
                          Check-Out Date
                        </label>
                        <input
                          type="date"
                          name="tgl_check_out"
                          id="tgl_check_out"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                          placeholder="Choose check out date"
                          value={this.state.tgl_check_out}
                          onChange={this.handleChange}
                          min={this.state.tgl_check_out}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        class="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      >
                        Simpan
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
