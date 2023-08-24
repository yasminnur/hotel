import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBed,
  faUsers,
  faUser,
  faHistory,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import "../css/sidebar.css";

export default class Sidebar extends React.Component {
  constructor() {
    super();
    this.state = {
      role: "",
    };
    this.state.role = localStorage.getItem("role");
  }

  logOut = () => {
    if (window.confirm("Are you sure to logout")) {
      window.location = "/";
      localStorage.clear();
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("username");
    }
  };

  checkRole = () => {
    if (this.state.role !== "admin" && this.state.role !== "resepsionis") {
      localStorage.clear();
      window.alert("You're not admin or resepsionis!");
      window.location = "/";
    }
  };

  componentDidMount() {
    this.checkRole();
  }

  render() {
    return (
      <aside class="z-10 sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-[#354D51] ">
        <div class="sidebar-header flex items-center justify-center py-4">
          <div class="inline-flex">
            <a href="#" class="inline-flex flex-row items-center">
              {/* <img src="/assets/logo.png" class="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 20 20" /> */}
              <span class="leading-10 text-white text-2xl font-bold ml-1 uppercase">
                Nyaman
              </span>
            </a>
          </div>
        </div>
        <div class="sidebar-content px-4 py-6">
          <ul class="flex flex-col w-full">
            <li class="my-px">
              <a
                href="/dashboard"
                class="flex flex-row items-center h-10 px-3 rounded-lg  hover:bg-white/25"
              >
                <span class="mr-2 flex items-center justify-center text-lg text-white">
                  <img src="/icon/dashboard.png" alt=""></img>
                </span>
                <span class="ml-3 text-white">Dashboard</span>
              </a>
            </li>
            <li class="my-px">
              <a
                href="/typeroom"
                class="flex flex-row items-center h-10 px-3 hover:bg-white/25 hover:text-blue-800 font-base"
              >
                <span class="mr-2 flex items-center justify-center text-lg text-gray-400">
                  <img src="/icon/list.png"></img>
                </span>
                <span class="ml-3 text-white">Type Room</span>
              </a>
            </li>
            <li class="my-px">
              <a
                href="/room"
                class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
              >
                <span class="mr-3 flex items-center justify-center text-lg text-gray-400">
                  <img src="/icon/kasur.png" alt=""></img>
                </span>
                <span class="ml-3 text-white">Room</span>
              </a>
            </li>
            <li class="my-px">
              <a
                href="/user"
                class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
              >
                <span class="mr-3 flex items-center justify-center text-lg text-gray-400">
                  <img src="/icon/user.png" alt=""></img>
                </span>
                <span class="ml-4 text-white">User</span>
              </a>
            </li>
            <li class="my-px">
              <a
                href="/historytransaksi"
                class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-base"
              >
                <span class="mr-3 flex items-center justify-center text-lg text-gray-400">
                  <img src="/icon/history.png" alt=""></img>
                </span>
                <span class="ml-3 text-white">History Transaksi</span>
              </a>
            </li>
            <li class="my-px" onClick={() => this.logOut()}>
              <a
                href="/"
                class="flex flex-row items-center h-10 px-3 rounded-lg text-blue-600 hover:bg-blue-100 hover:text-blue-800 mt-32"
              >
                <span class="mr-3 flex items-center justify-center text-lg text-red-400">
                  <img src="/icon/logOut.png" alt=""></img>
                </span>
                <span class="ml-2 text-white" onClick={() => this.logOut()}>
                  Logout
                </span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    );
  }
}
