import React from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

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
    let url = "http://localhost:4000/user/login";
    axios
      .post(url, data)
      .then((response) => {
        this.setState({ logged: response.data.data.logged });
        if (response.status === 200) {
          let id = response.data.data.id;
          let token = response.data.data.token;
          let role = response.data.data.role;
          let email = response.data.data.email;
          localStorage.setItem("id", id);
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          localStorage.setItem("email", email);
          alert("Success Login");
          window.location.href = "/dashboard";
        } else {
          alert(response.data.message);
          this.setState({ message: response.data.message });
        }
        this.setState({ logged: true });
      })
      .catch((error) => {
        console.log("error", error.response.status);
        if (error.response.status === 500 || error.response.status === 404) {
          window.alert("Failed to login dashboard");
        }
      });
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.setState({ logged: true });
    }
  }

  render() {
    if (this.state.logged) {
      return <Navigate to="/dashboard" />;
    }

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
              class="rounded px-8 pt-6 p-8 m-24 mt-30"
              onSubmit={(e) => this.handleLogin(e)}
            >
              <p class="text-gray-700 text-3xl font-bold mb-10 text-center">
                Login
              </p>
              <div class="mb-4">
                <label
                  class="block text-gray-700 text-lg font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  class="appearance-none rounded-xl h-[64px] w-full py-2 px-3 text-gray-700 mb-3 leading-tight border-2 border-gray-300 focus:shadow-outline"
                  placeholder="Contoh : Josh@gmail.com"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div class="mb-16">
                <label
                  class="block text-gray-700 text-lg font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  class="appearance-none rounded-xl h-[64px] w-full py-2 px-3 text-gray-700 mb-3 leading-tight border-2 border-gray-300 focus:shadow-outline"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div class="flex items-center justify-center">
                <button
                  type="submit"
                  name="login"
                  class="bg-[#354D51] h-[60px] hover:bg-[#50757b] text-white font-bold py-2 w-1/3 rounded focus:outline-none focus:shadow-outline"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
