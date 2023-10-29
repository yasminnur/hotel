import React from "react";
import "../css/sidebar.css";

export default class Sidebar extends React.Component {
  constructor() {
    super();
    this.state = {
      role: "",
      email: "",
    };
    this.state.role = localStorage.getItem("role");
    this.state.email = localStorage.getItem("email");
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
      <aside class="z-10 fixed sidebar h-full w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-[#354D51] ">
        <div class="sidebar-header flex items-center justify-center py-4">
          <div class="inline-flex">
            <a href="#" class="inline-flex flex-row items-center no-underline">
              <img
                src="/assets/logo putih.png"
                class="w-12 h-12"
                fill="currentColor"
                viewBox="0 0 20 20"
                alt=""
              />
              <span class="leading-10 text-white text-2xl font-bold ml-1 uppercase">
                Nyaman
              </span>
            </a>
          </div>
        </div>
        <div class="sidebar-content px-4 py-6 border-5 mb-20">
          <ul class="flex flex-col w-full">
            <li class="my-px ">
              <a
                href="/dashboard"
                class="flex flex-row items-center hover:bg-white/25 h-10 px-3 rounded-lg no-underline "
              >
                <span class="mr-2 flex items-center justify-center text-lg text-white">
                  <img src="/icon/dashboard.png" alt=""></img>
                </span>
                <span class="ml-3 text-white">Dashboard</span>
              </a>
            </li>
            <li class="my-px ">
              <a
                href="/typeroom"
                class="flex flex-row items-center hover:bg-white/25 h-10 px-3 rounded-lg no-underline  font-base"
              >
                <span class="mr-2 flex items-center justify-center text-lg text-gray-400">
                  <img src="/icon/list.png"></img>
                </span>
                <span class="ml-3 text-white">Type Room</span>
              </a>
            </li>
            <li class="my-px ">
              <a
                href="/room"
                class="flex flex-row items-center hover:bg-white/25 h-10 px-3 rounded-lg no-underline text-blue-600  font-base"
              >
                <span class="mr-3 flex items-center justify-center text-lg text-gray-400">
                  <img src="/icon/kasur.png" alt=""></img>
                </span>
                <span class="ml-3 text-white">Room</span>
              </a>
            </li>
            <li class="my-px ">
              <a
                href="/user"
                class="flex flex-row items-center h-10 hover:bg-white/25 px-3 rounded-lg no-underline text-blue-600 font-base"
              >
                <span class="mr-3 flex items-center justify-center text-lg text-gray-400">
                  <img src="/icon/user.png" alt=""></img>
                </span>
                <span class="ml-4 text-white">User</span>
              </a>
            </li>
            <li class="my-px ">
              <a
                href="/historytransaksi"
                class="flex flex-row items-center hover:bg-white/25 h-10 px-3 rounded-lg no-underline text-blue-600 font-base"
              >
                <span class="mr-3 flex items-center justify-center text-lg text-gray-400">
                  <img src="/icon/history.png" alt=""></img>
                </span>
                <span class="ml-3 text-white">History Transaksi</span>
              </a>
            </li>
            <li class="my-px  mt-32" onClick={() => this.logout()}>
              <a
                href="/"
                class="flex flex-row hover:bg-white/25 items-center h-10 px-3 rounded-lg no-underline  "
              >
                <span class="mr-3 flex items-center justify-center text-lg ">
                  <img src="/icon/logOut.png" alt=""></img>
                </span>
                <span class="ml-2 text-red-400">Logout</span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div class="flex flex-col items-center border-white border-t">
            <div class="flex flex-col text-center px-5">
              <span class="text-white font-bold text-lg leading-none mt-3">
                {this.state.role}
              </span>
              <span class="text-white text-xs leading-none mt-1 mb-10">
                {this.state.email}
              </span>
            </div>
          </div>
        </div>
      </aside>
    );
  }
}
