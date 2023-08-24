import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios'
import Navbar from '../Components/Navbar'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import LinesEllipsis from "react-lines-ellipsis";
import $ from "jquery";
import moment from "moment";

export default class Home extends React.Component {
    constructor() {
        super()
        this.state = {
            in: "",
            out: "",
            tipeKamarId: "",
            name_tipe_kamar: "",
            harga: "",
            description: "",
            foto: "",
            rooms: [],
            pemesanan: [],
            pemesananId: "",
            userId: "",
            customerId: "",
            tipeKamarId: "",
            nomor_pemesanan: "",
            tgl_pemesanan: "",
            tgl_check_in: "",
            tgl_check_out: "",
            nama_tamu: "",
            jumlah_kamar: "",
            typeroom: [],
            user: [],
            role: "",
            token: "",
            action: "",
            isLogin: false,
        }

        this.state.customerId = localStorage.getItem("id")
        this.state.token = localStorage.getItem("token")
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header;
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleClose = () => {
        $("#modal_detail").hide()
    }

    handleDetail = (item) => {
        $("#modal_detail").show()
        this.setState({
            tipeKamarId: item.tipeKamarId,
            nama_tipe_kamar: item.nama_tipe_kamar,
            harga: item.harga,
            description: item.description,
            foto: item.foto
        })
    }

    handleClosepemesanan = () => {
        $("#modal_pemesanan").hide()
    }

    showModal = () => {
        $("#modal_pemesanan").show()
        this.setState({
            userId: "",
            customerId: this.state.customerId,
            tipeKamarId: "",
            nomor_pemesanan: Math.floor(Math.random() * 90000) + 10000,
            tgl_pemesanan: moment().format('YYYY-MM-DD'),
            tgl_check_in: "",
            tgl_check_out: "",
            nama_tamu: "",
            jumlah_kamar: "",
            action: "insert"
        })

    }
    handleAddpemesanan = () => {
        let form = {
            userId: this.state.userId,
            customerId: this.state.customerId,
            tipeKamarId: this.state.tipeKamarId,
            nomor_pemesanan: this.state.nomor_pemesanan,
            tgl_pemesanan: this.state.tgl_pemesanan,
            tgl_check_in: this.state.tgl_check_in,
            tgl_check_out: this.state.tgl_check_out,
            nama_tamu: this.state.nama_tamu,
            jumlah_kamar: this.state.jumlah_kamar
        }
        let url = "http://localhost:4000/pemesanan/add"
        axios.post(url, form, this.headerConfig())
            .then(response => {
                this.getpemesanan()
                this.handleClose()
                window.location = "/mypemesanans"
            })
            .catch(error => {
                console.log("error add data", error)
                if (error.response.status === 500 || error.response.status === 404) {
                    window.alert("Failed pemesanan room");
                }
            })
    }

    _handleFilter = () => {
        let data = {
            tgl_check_in: this.state.in,
            tgl_check_out: this.state.out
        }
        let url = "http://localhost:4000/kamar/find/"
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        rooms: response.data.room,
                    })
                    console.log(response.data.room)
                } else {
                    alert(response.data.message)
                    this.setState({ message: response.data.message })

                }
            })
            .catch(error => {
                console.log("error", error.response.status)
            })
    }

    getpemesanan = () => {
        let url = "http://localhost:4000/pemesanan"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({
                    room: response.data.data
                })
                console.log(response.data.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    getTypeRoom = () => {
        let url = "http://localhost:4000/tipeKamar"
        axios.get(url)
            .then(response => {
                this.setState({
                    typeroom: response.data.data
                })
                console.log(response.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getUser = () => {
        let url = "http://localhost:4000/user/"
        axios.get(url)
            .then(response => {
                this.setState({
                    user: response.data.data
                })
                console.log(response.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    showAlertMustLogin = () => {
        window.alert("You must Register or Login as Customer");
        window.location = "/logincust"
    }

    componentDidMount() {
        this.getpemesanan()
        this.getTypeRoom()
        this.getUser()
        if (this.state.token) {
            this.setState({
                isLogin: true
            })
        }
    }

    render() {
        return (
            <div>
                <div name='home' className='relative bg-gray-50 flex flex-col justify-between'>
                    <Navbar />
                    <div className='grid md:grid-cols-2 max-w-[1240px] m-auto'>
                        <div>
                            <img className='mt-6 ml-32 mb-10 w-3/5 h-96' src="/assets/photoHome.png" alt="/" />
                        </div>
                        <div className='flex flex-col justify-center md:items-start w-full px-2 py-8'>
                            <p className='py-3 text-5xl md:text-5xl font-bold'>Find <span className="text-blue-600">Suitable</span> Room</p>
                            <p className='text-5xl md:text-5xl font-bold mb-8'>With Slippy.</p>
                            <p className='text-md mr-12 mb-4'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour,or randomised but the majority have suffered alteration </p>
                            {this.state.isLogin ?
                                <button className='py-2 px-1 sm:w-[25%] my-4 text-white border bg-blue-500 border-blue-500 rounded-md text-lg font-semibold hover:bg-blue-600 hover:text-white' onClick={() => this.showModal()}>pemesanan Now</button> :
                                <button className='py-2 px-1 sm:w-[25%] my-4 text-white border bg-blue-500 border-blue-500 rounded-md text-lg font-semibold hover:bg-blue-600 hover:text-white' onClick={() => this.showAlertMustLogin()} >pemesanan Now</button>
                            }
                        </div>
                    </div>

                    <div class="flex flex-col mr-19 ml-11 mb-8">
                        <div class="ml-48 w-3/5 bg-white-200 border-2 border-grey rounded-lg shadow h-auto">
                            <div class="flex flex-row">
                                <div className="pr-10 pl-10 pt-5 pb-6">
                                    <div class="flex items-center">
                                        <div className="mr-3 bg-blue-200 p-4 rounded-md h-auto">
                                            <FontAwesomeIcon icon={faCalendar} size="2x" color="blue" /></div>
                                        <div>
                                            <h3 className="mb-1 font-bold">Check-In Date</h3>
                                            <input type="date" name="in" id="in" className="border-2 border-blue-400 rounded-md p-1" value={this.state.in} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="pr-10 pl-4 pt-5 pb-6">
                                    <div class="flex items-center">
                                        <div className="mr-3 bg-blue-200 p-4 rounded-md h-auto">
                                            <FontAwesomeIcon icon={faCalendar} size="2x" color="blue" /></div>
                                        <div>
                                            <h3 className="mb-1 font-bold">Check-Out Date</h3>
                                            <input type="date" name="out" id="out" className="border-2 border-blue-400 rounded-md p-1" value={this.state.out} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="pr-2 pl-2 pt-9 pb-6">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 pr-3 pl-3 w-full rounded focus:outline-none focus:shadow-outline" onClick={this._handleFilter}>Check Rooms</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ini buat available room */}
                    {this.state.rooms.length > 0 && (
                        <div className="m-6 pl-6">
                            <p className="text-5xl font-bold mt-2"><span className="text-blue-600">Available</span> Room </p>

                            <div class="grid grid-cols-4 gap-4 mt-8">
                                {this.state.rooms.map((item, index) => (
                                    <div class="col-span-1">
                                        {/* Card untuk type room */}
                                        <div class="CardEvent">
                                            <div class="max-w-sm rounded overflow-hidden shadow-lg border-2 border-gray-200 bg-gray-100">
                                                <div className='container'>
                                                    <img class="w-full h-48" src={"http://localhost:4000/uploads/image/" + item.foto} />
                                                </div>
                                                <div class="px-6 py-4">
                                                    <div class="font-bold text-2xl mb-2">{item.nama_tipe_kamar}</div>
                                                    <div class="font-bold text-xl mb-2 text-blue-600">Rp {item.harga}/night</div>
                                                    <p class="text-gray-700 text-base">
                                                        <LinesEllipsis
                                                            text={item.description}
                                                            maxLine="3"
                                                            ellipsis="..."
                                                        />
                                                    </p>
                                                    <div class="px-2 py-0.5 text-base mt-2 inline-flex leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {item.room.length} room available
                                                    </div>
                                                </div>
                                                <div class="px-6 pt-4 pb-2">
                                                    <button class="mb-2 ml-40 bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 w-1/3 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => this.handleDetail(item)}>
                                                        Detail
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div >

                {/* modal detail room */}
                <div id="modal_detail" tabindex="-1" class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full pt-10 pb-10 pl-96 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50" >
                    <div class="relative w-full h-full max-w-lg md:h-auto border-2 border-gray-500 rounded-lg shadow shadow-2xl items-center">
                        <div class="relative bg-white rounded-lg">
                            <div class="flex items-center justify-between p-5 border-b rounded-t border-gray-500">
                                <h3 class="p-2 text-xl font-medium text-gray-900 ">
                                    {this.state.nama_tipe_kamar}
                                </h3>
                                <button type="button" class="text-gray-400 bg-transparent hover:bg-red-500 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white" data-modal-hide="medium-modal" onClick={() => this.handleClose()}>
                                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div class="p-6">

                                <div className='container'>
                                    <img class="rounded-md w-200 h-100" src={"http://localhost:4000/uploads/image/" + this.state.foto} />
                                </div>
                                <div class="px-2 py-4">
                                    <div class="font-bold text-2xl mb-2">{this.state.nama_tipe_kamar}</div>
                                    <div class="font-bold text-xl mb-2 text-blue-600">{this.state.harga}/night</div>
                                    <p class="text-black-700 text-base">
                                        {this.state.description}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Form */}
                <div id="modal_pemesanan" tabindex="-1" class="overflow-x-auto fixed top-0 left-0 right-0 z-50 hidden w-full pt-10 pb-10 pl-96 md:inset-0 h-modal md:h-full bg-tranparent bg-black bg-opacity-50" >
                    <div class="relative w-full h-full max-w-lg md:h-auto border-2 border-gray-500 rounded-lg shadow shadow-2xl items-center">
                        <div class="relative bg-white rounded-lg">
                            <div class="flex items-center justify-between p-5 border-b rounded-t border-gray-500">
                                <h3 class="p-2 text-xl font-medium text-gray-900 ">
                                    Add pemesanan Room
                                </h3>
                                <button type="button" class="text-gray-400 bg-transparent hover:bg-red-500 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white" data-modal-hide="medium-modal" onClick={() => this.handleClosepemesanan()}>
                                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div class="p-2">
                                <div class="px-8 py-2 ">
                                    <form class="space-y-6" onSubmit={(event) => this.handleAddpemesanan(event)}>
                                        <div>
                                            <label for="nama_tamu" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Guest Name</label>
                                            <input type="text" name="nama_tamu" id="nama_tamu" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Name for guest" value={this.state.nama_tamu} onChange={this.handleChange} required />
                                        </div>
                                        <div>
                                            <label for="jumlah_kamar" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Total Room </label>
                                            <input type="number" name="jumlah_kamar" id="jumlah_kamar" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Total room your booked" value={this.state.jumlah_kamar} onChange={this.handleChange} required />
                                        </div>
                                        <div>
                                            <label for="tipeKamarId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Room Type</label>
                                            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black" placeholder="Jenis Room Type" name="tipeKamarId" value={this.state.tipeKamarId} onChange={this.handleChange} required>
                                                <option value="">Choose Room Type</option>
                                                {this.state.typeroom.map((item, index) => (
                                                    <option value={item.tipeKamarId}>{item.nama_tipe_kamar}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label for="tgl_pemesanan" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">pemesanan Date</label>
                                            <input type="text" name="tgl_pemesanan" id="tgl_pemesanan" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="pemesanan Date" value={moment().format('YYYY-MM-DD')} onChange={this.handleChange} required disabled />
                                        </div>
                                        <div>
                                            <label for="tgl_check_in" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Check-In Date</label>
                                            <input type="date" name="tgl_check_in" id="tgl_check_in" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Choose check in date" value={this.state.tgl_check_in} onChange={this.handleChange} required />
                                        </div>
                                        <div>
                                            <label for="tgl_check_out" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Check-Out Date</label>
                                            <input type="date" name="tgl_check_out" id="tgl_check_out" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-800" placeholder="Choose check out date" value={this.state.tgl_check_out} onChange={this.handleChange} required />
                                        </div>
                                        <div>
                                            <label for="userId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-800">Resepsionis</label>
                                            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-gray-800 block w-full p-2.5 dark:bg-white dark:border-gray-500 dark:placeholder-gray-400 dark:text-black" placeholder="Jenis Room Type" name="userId" value={this.state.userId} onChange={this.handleChange} required>
                                                <option value="">Confirm your pemesanan with</option>
                                                {this.state.user.map((item, index) => (
                                                    <option value={item.userId}>{item.user_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="submit" class="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Simpan</button>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div >

        )
    }


}