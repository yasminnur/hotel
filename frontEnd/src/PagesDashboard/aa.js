// {Array.isArray(this.state.pemesanan) &&
//     this.state.pemesanan.map((item, index) => {
//       return (
//         <tr key={index}>
//           <td className="px-6 py-4 whitespace-nowrap">
//             <div className="flex items-center">
//               <div className="text-sm font-medium text-gray-900">
//                 {item.nomor_pemesanan}
//               </div>
//             </div>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap">
//             <div className="text-sm text-gray-900">
//               {item.nama_pemesan}
//             </div>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap">
//             <div className="text-sm text-gray-900">
//               {item.nama_tamu}
//             </div>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap">
//             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//               {item.tipe_kamar?.nama_tipe_kamar}
//             </span>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap">
//             <div className="text-sm text-gray-900">
//               {item.jumlah_kamar}
//             </div>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap">
//             <div className="text-sm text-gray-900">
//               {moment(item.tgl_pemesanan).format(
//                 "DD-MM-YYYY"
//               )}
//             </div>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap">
//             <div className="text-sm text-gray-900">
//               {moment(item.tgl_check_in).format(
//                 "DD-MM-YYYY"
//               )}
//             </div>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap">
//             <div className="text-sm text-gray-900">
//               {moment(item.tgl_check_out).format(
//                 "DD-MM-YYYY"
//               )}
//             </div>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap">
//             {item.status_pemesanan === "baru" && (
//               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
//                 {item.status_pemesanan}
//               </span>
//             )}
//             {item.status_pemesanan === "check_in" && (
//               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                 {item.status_pemesanan}
//               </span>
//             )}
//             {item.status_pemesanan === "check_out" && (
//               <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
//                 {item.status_pemesanan}
//               </span>
//             )}
//           </td>
//           {this.state.role === "resepsionis" && (
//             <td className="px-6 py-4 whitespace-nowrap">
//               <button
//                 className={`bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded mr-2 ${
//                   item.status_pemesanan === "check_out"
//                     ? "opacity-50 cursor-not-allowed"
//                     : ""
//                 }`}
//                 onClick={() =>
//                   this.handleEditStatus(item)
//                 }
//                 disabled={
//                   item.status_pemesanan === "check_out"
//                 }
//               >
//                 <FontAwesomeIcon
//                   icon={faPencilSquare}
//                   size="lg"
//                 />
//               </button>
//             </td>
//           )}
//         </tr>
//       );
//     })}