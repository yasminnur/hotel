import React from "react";
import axios from "axios";

export default class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      nama: "",
      email: "",
      password: "",
      telepon: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleRegister = (e) => {
    e.preventDefault();

    let data = {
      nama: this.state.nama,
      email: this.state.email,
      password: this.state.password,
      telepon: this.state.telepon,
    };
    let url = "http://localhost:4000/customer/register";
    axios
      .post(url, data)
      .then((res) => {
        window.alert("Success to Register");
        window.location.href = "/logincust";
      })
      .catch((error) => {
        console.log("error", error.response.status);
        if (error.response.status === 500) {
          window.alert("Failed Register as Customer");
        }
      });
  };

  render() {
    return (
      <div className="dashboard1">
        <div class="flex">
          <div class="w-1/2 bg-gray-500 text-center">
            <img
              src="/assets/login hotel.jpg"
              className="w-screen h-screen"
              alt=""
            />
          </div>
          <div class="w-1/2 text-left">
            <form
              class=" rounded px-8 pt-6 p-8 m-24 mt-6"
              onSubmit={(e) => this.handleRegister(e)}
            >
              <p class="text-gray-700 text-2xl font-bold mb-4 text-center">
                Register
              </p>
              <p class="text-gray-700 text-sm font-normal mb-6 text-center">
                Silahkan Register sebagai Customer Hotel Nyaman
              </p>
              <div class="mb-2">
                <label
                  class="block text-gray-700 text-sm font-bold mb-2"
                  for="nama"
                >
                  Nama
                </label>
                <input
                  class="appearance-none rounded-xl h-[64px] w-full py-2 px-3 text-gray-700 mb-3 leading-tight border border-black"
                  id="nama"
                  name="nama"
                  placeholder="Contoh: Josh ganteng"
                  value={this.state.nama}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div class="mb-2">
                <label
                  class="block text-gray-700 text-sm font-bold mb-2"
                  for="email"
                >
                  Email
                </label>
                <input
                  class="appearance-none rounded-xl h-[64px] w-full py-2 px-3 text-gray-700 mb-3 leading-tight border border-black"
                  id="email"
                  name="email"
                  placeholder="Contoh: Josh@gmail.com"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div class="mb-2">
                <label
                  class="block text-gray-700 text-sm font-bold mb-2"
                  for="password"
                >
                  Password
                </label>
                <input
                  class="appearance-none rounded-xl h-[64px] w-full py-2 px-3 text-gray-700 mb-3 leading-tight border border-black"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div class="mb-14">
                <label
                  class="block text-gray-700 text-sm font-bold mb-2"
                  for="telepon"
                >
                  Telepon
                </label>
                <input
                  class="appearance-none rounded-xl h-[64px] w-full py-2 px-3 text-gray-700 mb-3 leading-tight border border-black"
                  id="telepon"
                  name="telepon"
                  placeholder="Contoh: 08xxxxxxxxxx"
                  value={this.state.telepon}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div class="flex items-center justify-center">
                <button
                  class="bg-[#354D51] h-[60px] hover:bg-blue-500 text-white font-bold py-2 w-1/3 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
