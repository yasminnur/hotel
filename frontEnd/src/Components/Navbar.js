import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut} from "@fortawesome/free-solid-svg-icons";

export default class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      role: "",
      token: "",
      isLogin: false,
    };

    this.state.role = localStorage.getItem("role");
    this.state.token = localStorage.getItem("token");
  }

  logout = () => {
    if (window.confirm("Are you sure to logout?")) {
      window.location = "/";
      localStorage.clear();
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      this.setState({
        isLogin: false,
      });
    }
  };

  componentDidMount() {
    if (this.state.token) {
      this.setState({
        isLogin: true,
      });
    }

  }

  render() {
    return (
      <nav class="px-5 sm:px-8 w-full z-20 top-0 left-0 h-[70px]">
        <div class="container flex flex-wrap items-center justify-between mx-auto">
          <div to="/home" className="inline-flex h-10 ml-3 w-10 mr-0 mb-[600px]">
            <img src="/assets/logo.png" alt="icon" />
            <span class="text-xl font-bold ml-4 uppercase">nyaman</span>
          </div>
          <div class="flex md:order-2 -mt-[675px] ">
            {this.state.isLogin ? (
              <>
                <button
                  onClick={() => this.logout()}
                  className="no-underline text-gray-800 px-3 mt-5 hover:text-red-800 rounded-md text-2xl font-medium"
                  aria-current="page"
                >
                  <FontAwesomeIcon icon={faSignOut} />
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/logincust"
                  className="bg-transparent hover:bg-[#354D51] text-[#354D51] hover:text-[#354D51] mt-5 font-semibold py-2 px-3 border border-[#354D51] rounded-md mr-4"
                  aria-current="page"
                  id="profile"
                  variant="outlined"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/registercust"
                  className="bg-[#354D51] hover:bg-[#354D51] mt-5 text-white font-semibold hover:text-white py-2 px-3 border border-[#354D51] hover:border-transparent rounded-md "
                  aria-current="page"
                  id="profile"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
          <div
            class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 bg-green-200"
            id="navbar-sticky"
          >
            <ul class="flex absolute flex-col top-0 pt-3 left-[500px] h-[70px] md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 bg-transparent">
              {this.state.isLogin ? (
                <>
                  <NavLink
                    to="/home"
                    className="no-underline text-gray-800 px-3 py-3 text-sm font-medium border-[#354D51] hover:bg-[#354D51] hover:text-white p-3 rounded-xl"
                    aria-current="page"
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/services"
                    className="no-underline text-gray-800 px-3 py-3 text-sm font-medium border-[#354D51] hover:bg-[#354D51] hover:text-white p-3 rounded-xl"
                    aria-current="page"
                  >
                    Services
                  </NavLink>
                  <NavLink
                    to="/rooms"
                    className="no-underline text-gray-800 px-3 py-3 text-sm font-medium border-[#354D51] hover:bg-[#354D51] hover:text-white p-3 rounded-xl"
                    aria-current="page"
                  >
                    Rooms
                  </NavLink>
                  <NavLink
                    to="/mybookings"
                    className="no-underline text-gray-800 px-3 py-3 text-sm font-medium border-[#354D51] hover:bg-[#354D51] hover:text-white p-3 rounded-xl"
                    aria-current="page"
                  >
                    My Bookings
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/home"
                    className="no-underline text-gray-800 px-3 py-3 text-sm font-medium border-[#354D51] hover:bg-[#354D51] hover:text-white p-3 rounded-xl"
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/services"
                    className="no-underline text-gray-800 px-3 py-3 text-sm font-medium border-[#354D51] hover:bg-[#354D51] hover:text-white p-3 rounded-xl"
                    aria-current="page"
                  >
                    Services
                  </NavLink>
                  <NavLink
                    to="/rooms"
                    className="no-underline text-gray-800 px-3 py-3 text-sm font-medium border-[#354D51] hover:bg-[#354D51] hover:text-white p-3 rounded-xl"
                    aria-current="page"
                  >
                    Rooms
                  </NavLink>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
