import React from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPencilSquare,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import $ from "jquery";

export default class User extends React.Component {
  constructor() {
    super();
    this.state = {
      user: [],
      id: "",
      nama_user: "",
      foto: "",
      email: "",
      password: "",
      role: "",
      token: "",
      action: "",
      keyword: "",
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

  handleClose = () => {
    $("#modal_user").hide();
  };

  handleFile = (e) => {
    this.setState({
      foto: e.target.files[0],
    });
  };

  _handleFilter = () => {
    let data = {
      keyword: this.state.keyword,
    };
    let url = "http://localhost:4000/user/find";
    axios
      .post(url, data, this.headerConfig())
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            user: response.data.data,
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

  handleAdd = () => {
    $("#modal_user").show();
    this.setState({
      id: "",
      nama_user: "",
      foto: "",
      email: "",
      password: "",
      role: "",
      action: "insert",
    });
  };

  handleEdit = (item) => {
    $("#modal_user").show();
    this.setState({
      id: item.id,
      nama_user: item.nama_user,
      foto: item.foto,
      email: item.email,
      password: item.password,
      role: item.role,
      action: "update",
    });
  };

  _handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      this._handleFilter();
    }
  };
  handleSave = (e) => {
    e.preventDefault();

    let form = new FormData();
    form.append("id", this.state.id);
    form.append("nama_user", this.state.nama_user);
    form.append("foto", this.state.foto);
    form.append("email", this.state.email);
    form.append("password", this.state.password);
    form.append("role", this.state.role);

    if (this.state.action === "insert") {
      let url = "http://localhost:4000/user/add";
      axios
        .post(url, form, this.headerConfig())
        .then((response) => {
          this.getUser();
          this.handleClose();
        })
        .catch((error) => {
          console.log("error add data", error.response.status);
          if (error.response.status === 500) {
            window.alert("Failed to add data");
          }
        });
    } else {
      let url = "http://localhost:4000/user/update/" + this.state.id;
      axios
        .put(url, form, this.headerConfig())
        .then((response) => {
          this.getUser();
          this.handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  handleDrop = (id) => {
    let url = "http://localhost:4000/user/delete/" + id;
    if (window.confirm("Are you sure to delete this customer ? ")) {
      axios
        .delete(url, this.headerConfig())
        .then((response) => {
          console.log(response.data.message);
          this.getUser();
        })
        .catch((error) => {
          if (error.response.status === 500) {
            window.alert("You can't delete this data");
          }
        });
    }
  };

  getUser = () => {
    let url = "http://localhost:4000/user/user";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({
          user: response.data.data,
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
    this.getUser();
    this.checkRole();
    this.headerConfig();
  }

  render() {
    return (
      <div className="flex flex-row min-h-screen bg-white text-gray-800">
        <Sidebar />
        <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
          <div className="main-content flex flex-col flex-grow p-4">
            <div className="hidden md:flex relative mb-4">
              <h1 className="font-bold text-2xl text-gray-700">User</h1>
            </div>

            <div className="mb-4">
              <div className="flex items-center ">
                <div className="flex rounded w-full">
                <input
                    type="text"
                    className=" w-full block px-4 py-2 bg-white border-2 border-black/25 rounded-full focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Search..."
                    name="keyword"
                    value={this.state.keyword}
                    onChange={this.handleChange}
                    onKeyPress={this._handleKeyPress}
                  />
                  {/* <button
                    className="w-1/8 ml-2 px-4 text-white bg-blue-100 border border-1 border-blue-600 rounded hover:bg-blue-200"
                    onClick={this._handleFilter}
                  >
                    <FontAwesomeIcon icon={faSearch} color="blue" />
                  </button> */}
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
            <div>
            {this.state.role === "admin" && (
  <div className="w-full h-12 rounded-[13px] border-[0.5px] border-black grid grid-cols-7 divide-x-0 mb-3">
    <div className="my-auto px-2">Aksi</div>
  </div>
)}
{this.state.role !== "admin" && (
  <div className="w-full h-12 rounded-[13px] border-[0.5px] border-black grid grid-cols-6 divide-x-0 mb-3">
    {/* ...kolom lainnya */}
  

            
                            {/* <div className="w-full h-12 rounded-[13px] border-[0.5px] border-black grid grid-cols-6 divide-x-0 mb-3">aksi</div> */}
         
              {/* <div className="w-full h-12 rounded-[13px] border-[0.5px] border-black grid grid-cols-5 divide-x-0 mb-3"> */}
                  
                {/* <div className="h-full w-5 pl-10 py-2">No
                <div className="h-full w-5 py-2 ">No</div>
                </div> */}
                <div className="my-auto px-5">No</div>
                <div className="my-auto px-2">Foto</div>
                <div className="my-auto px-2">Username</div>
                <div className="my-auto px-2">Email</div>
                <div className="my-auto px-2">Role</div>
                {this.state.role === "admin" && (
                            <div className="my-auto px-2">aksi</div>
                          )}
                </div>
)}
              {/* </div> */}
  
              
              <div>
                {this.state.user.map((item, index) => {
                  return (
                    <div key={index}
                    className={`w-full h-16 rounded-[20px] border-[0.2px] border-black grid grid-cols-${
                      this.state.role === "admin" ? "6" : "5"
                    } divide-x-0 my-2`}>
                      
                      {/* no */}
                      <div className="my-auto px-5 text-sm text-gray-900">
                        {index + 1}
                      </div>

                      {/* foto */}
                      <div className="my-auto px-2 ">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={"http://localhost:4000/photo/" + item.foto}
                          alt=""
                        />
                      </div>

                      {/* nama user */}
                      <div className="my-auto px-2 items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {item.nama_user}
                        </div>
                      </div>

                      {/* email */}
                      <div className="my-auto px-2 text-sm text-gray-900">
                        {item.email}
                      </div>

                      {/* role */}
                      <div className="my-auto px-2">
                        {item.role === "admin" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            {item.role}
                          </span>
                        )}
                        {item.role === "resepsionis" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                            {item.role}
                          </span>
                        )}
                      </div>

                      {/* edit & delete  */}
                      {this.state.role === "admin" && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded mr-2"
                                  onClick={() => this.handleEdit(item)}
                                >
                                  <FontAwesomeIcon
                                    icon={faPencilSquare}
                                    size="lg"
                                  />
                                </button>
                                <button
                                  className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                                  onClick={() => this.handleDrop(item.id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} size="lg" />
                                </button>
                              </td>
                            )}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* <div className="flex flex-col mt-2 mr-4">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            No
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            foto
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Username
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Role
                          </th>
                          {this.state.role === "admin" && (
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Aksi
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {this.state.user.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {index + 1}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={
                                      "http://localhost:4000/photo/" + item.foto
                                    }
                                    alt=""
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.nama_user}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {item.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {item.role === "admin" && (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    {item.role}
                                  </span>
                                )}
                                {item.role === "resepsionis" && (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                    {item.role}
                                  </span>
                                )}
                              </td>
                              {this.state.role === "admin" && (
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <button
                                    class="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded mr-2"
                                    onClick={() => this.handleEdit(item)}
                                  >
                                    <FontAwesomeIcon
                                      icon={faPencilSquare}
                                      size="lg"
                                    />
                                  </button>
                                  <button
                                    class="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                                    onClick={() => this.handleDrop(item.id)}
                                  >
                                    <FontAwesomeIcon icon={faTrash} size="lg" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          <footer class="footer px-4 py-2">
            <div class="footer-content">
              <p class="text-sm text-gray-600 text-center">
                © Brandname 2023. All rights reserved.{" "}
                <a href="https://twitter.com/iaminos">by Erairris</a>
              </p>
            </div>
          </footer>
        </main>

        {/* Modal Form */}
        <div
          id="modal_user"
          tabindex="-1"
          aria-hidden="true"
          class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full p-4 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50"
        >
          <div class="flex lg:h-auto w-auto justify-center ">
            <div class="relative bg-white rounded-lg shadow dark:bg-white w-1/3">
              <button
                type="button"
                class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
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
                <span class="sr-only">Tutup modal</span>
              </button>
              <div class="px-6 py-6 lg:px-8">
                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-black">
                  {this.state.action === "insert" ? "Add" : "Edit"} User
                </h3>
                <form
                  class="space-y-6"
                  onSubmit={(event) => this.handleSave(event)}
                >
                  <div>
                    <label
                      for="nama_user"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      Username User
                    </label>
                    <input
                      type="text"
                      name="nama_user"
                      id="nama_user"
                      value={this.state.nama_user}
                      onChange={this.handleChange}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                      placeholder="Masukkan username user"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      Email User
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                      placeholder="Masukkan email user"
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="password"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      Password User
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                      placeholder="Masukkan email user"
                      required
                      disabled={this.state.action === "update" ? true : false}
                    />
                  </div>
                  <div>
                    <label
                      for="role"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      Role
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                      placeholder="Jenis role"
                      name="role"
                      value={this.state.role}
                      onChange={this.handleChange}
                      required
                    >
                      <option value="">Pilih Role</option>
                      <option value="admin">Admin</option>
                      <option value="resepsionis">Resepsionis</option>
                    </select>
                  </div>
                  <div>
                    <label
                      for="foto"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800"
                    >
                      foto User
                    </label>
                    <input
                      type="file"
                      name="foto"
                      id="foto"
                      placeholder="Pilih foto user"
                      onChange={this.handleFile}
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-800 focus:border-gray-800 block w-full px-2 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800"
                      required={this.state.action === "update" ? false : true}
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
    );
  }
}
