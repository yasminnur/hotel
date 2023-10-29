import React from "react";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import "../styles/dashboard.css";

export default class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      user: [],
      tipeKamar: [],
      kamar: [],
      role: "",
      token: "",
      action: "",
    };

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

  getUser = () => {
    let url = "http://localhost:4000/user/";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({
          user: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // getCustomer = () => {
  //     let url = "http://localhost:4000/customer"
  //     axios.get(url)
  //         .then((response) => {
  //             this.setState({
  //                 customer: response.data.length
  //             })
  //         })
  //         .catch((error) => {
  //             console.log(error)
  //         })
  // }

  getkamar = () => {
    let url = "http://localhost:4000/kamar/kamar";
    axios
      .get(url)
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

  getTipeKamar = () => {
    let url = "http://localhost:4000/tipeKamar/tipeKamar/";
    axios
      .get(url)
      .then((response) => {
        this.setState({
          tipeKamar: response.data.data,
        });
        console.log(response.data.data);
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
    this.getkamar();
    this.getTipeKamar();
    this.checkRole();
  }

  render() {
    return (
      <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800 dashboard">
        <Sidebar />
        <main className="main flex flex-col flex-grow -ml-64 md:ml-64 transition-all duration-150 ease-in">
          <div className="container">
            <h1 className="bold-align-left">
              Make your
              <br />
              dreams beautiful
            </h1>

            <footer className="absolute bottom-0 w-full py-2 text-center">
              <div className="footer-content ">
                <p className="text-sm text-gray-600 text-center">
                  Copyright © 2023 Nyaman Hotel
                </p>
              </div>
            </footer>
            <div className="box"></div>
          </div>
        </main>
      </div>
    );
  }
}
