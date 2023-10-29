import React from "react";
import axios from "axios";

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      isModalOpen: false,
      logged: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleLogin = (e) => {
    e.preventDefault();
    let data = {
      email: this.state.email,
      password: this.state.password,
    };
    let url = "http://localhost:4000/customer/login";
    axios
      .post(url, data)
      .then((response) => {
        this.setState({ logged: response.data.data.logged });
        if (response.status === 200) {
          let id = response.data.data.id;
          let token = response.data.data.token;
          let email = response.data.data.email;
          let nama = response.data.data.nama;
          let telepon = response.data.data.telepon;
          let role = response.data.data.role;
          localStorage.setItem("id", id);
          localStorage.setItem("token", token);
          localStorage.setItem("email", email);
          localStorage.setItem("nama", nama);
          localStorage.setItem("telepon", telepon);
          localStorage.setItem("role", role);
          alert("Success Login");
          window.location.href = "/";
        } else {
          alert(response.data.message);
          this.setState({ message: response.data.message });
        }
      })
      .catch((error) => {
        console.log("error", error.response.status);
        if (error.response.status === 500 || error.response.status === 404) {
          window.alert("Failed to login Nyaman");
        }
      });
  };

  componentDidMount() {
    // Reset nilai state email menjadi string kosong ketika komponen dimount kembali
    this.setState({ email: "" });
  }

  render() {
    return (
      <div className="dashboard1">
        <div class="flex">
          <div class="w-1/2 bg-gray-500 text-center">
            <img
              src="/assets/login hotel.jpg"
              className="w-full h-screen"
              alt=""
            />
          </div>
          <div class="w-1/2 text-left">
            <form
              class=" px-8 pt-6 p-8 m-24 mt-30"
              onSubmit={(e) => this.handleLogin(e)}
            >
              <p class="text-gray-700 text-2xl font-bold mb-4 text-center">
                Login
              </p>
              <p class="text-gray-700 text-sm font-normal mb-6 text-center">
                Silahkan login untuk memesan kamar di Hotel Nyaman
              </p>
              <div class="mb-2">
                <label
                  class="block text-gray-700 text-sm font-bold mb-2"
                  for="email"
                >
                  Email
                </label>
                <input
                  class="appearance-none rounded-xl h-[64px] w-full py-2 px-3 text-gray-700 mb-3 leading-tight border-2 border-gray-300"
                  id="email"
                  name="email"
                  placeholder="Contoh : Josh@gmail.com"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div class="mb-14">
                <label
                  class="block text-gray-700 text-sm font-bold mb-2"
                  for="password"
                >
                  Password
                </label>
                <input
                  class="appearance-none rounded-xl h-[64px] w-full py-2 px-3 text-gray-700 mb-3 leading-tight border-2 border-gray-300 focus:shadow-outline"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div class="flex items-center justify-center">
                <button
                  class="bg-[#354D51] h-[60px] hover:bg-[#50757b] text-white font-bold py-2 w-1/3 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Login
                </button>
              </div>
              <p class="text-sm font-normal text-gray-700 text-center mt-3 ">
                Don’t have an account yet?{" "}
                <a
                  href="registercust"
                  class="font-medium text-[#354D51] hover:underline dark:text-primary-500"
                >
                  Register
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
