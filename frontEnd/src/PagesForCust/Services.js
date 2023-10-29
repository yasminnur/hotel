import React from "react";
import Navbar from "../Components/Navbar";

export default class Services extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="text-center pb-8 ">
          <p className="p-8 text-5xl font-bold">
            The <span className="text-[#354D51]">Services</span> You Get From
            Nyaman Hotel
          </p>
          <p className="mr-64 ml-64  text-gray-600 text-xl">
          Hotel Nyaman offers luxury and comfort in the heart of the city. With modern amenities, friendly service, and a central location, it's the perfect choice for both business and leisure travelers.
          </p>
            </div>
            
        <div className="flex flex-wrap gap-x-12 mx-10">
          {/* card 1  Swimmimng Pool*/}
          <div
            className="relative grid md:grid-cols-2 mt-10 rounded-xl my-10"
            style={{
              backgroundImage: 'url("/assets/pool.jpg")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              width: "323px",
              height: "400px",
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "flex-end", 
            }}
          >
            <div
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.8))",
                padding: "10px", 
                borderRadius: "10px",
              }}
            >
              <div class="text-white p-3">
                <h2 class="card-title">Swimming pool</h2>
                <p>Take a refreshing dip in our inviting swimming pool</p>
              </div>
            </div>
          </div>

          {/* card 2 Gym*/}
          <div
            className="relative grid md:grid-cols-2 mt-10 rounded-xl my-10"
            style={{
              backgroundImage: 'url("/assets/Gym.jpg")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              width: "323px",
              height: "400px",
              display: "flex", 
              flexDirection: "column",
              justifyContent: "flex-end", 
            }}
          >
            <div
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.8))", 
                padding: "10px", 
                borderRadius: "10px", 
              }}
            >
              <div class="text-white p-3">
                <h2 class="card-title">Gym</h2>
                <p>Stay fit and energized at our well-equipped gym</p>
              </div>
            </div>
          </div>

          {/* card 3 Sauna*/}
          <div
            className="relative grid md:grid-cols-2 mt-10 rounded-xl my-10"
            style={{
              backgroundImage: 'url("/assets/sauna.jpg")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              width: "323px",
              height: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.8))",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <div class="text-white p-3">
                <h2 class="card-title">Sauna</h2>
                <p>Relax and rejuvenate in our soothing sauna</p>
              </div>
            </div>
          </div>

          {/* card 4 PG1*/}
          <div
            className="relative grid md:grid-cols-2 mt-10 rounded-xl my-10"
            style={{
              backgroundImage: 'url("/assets/playground1.jpg")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              width: "323px",
              height: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.8))", 
                padding: "10px", 
                borderRadius: "10px", 
              }}
            >
              <div class="text-white p-3">
                <h2 class="card-title">Playground</h2>
                <p>Fun and games await at our exciting playground</p>
              </div>
            </div>
          </div>

          {/* card 5 Private Beach*/}
          <div
            className="relative grid md:grid-cols-2 mt-10 rounded-xl my-10"
            style={{
              backgroundImage: 'url("/assets/private beach.jpg")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              width: "323px",
              height: "400px",
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "flex-end", 
            }}
          >
            <div
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.8))", 
                padding: "10px",
                borderRadius: "10px", 
              }}
            >
              <div class="text-white p-3">
                <h2 class="card-title">Private Beach</h2>
                <p>Enjoy a tranquil getaway on our exclusive private beach</p>
              </div>
            </div>
          </div>

          {/* card 6 Basketball Court*/}
          <div
            className="relative grid md:grid-cols-2 mt-10 rounded-xl my-10"
            style={{
              backgroundImage: 'url("/assets/basket court.jpg")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              width: "323px",
              height: "400px",
              display: "flex",
              flexDirection: "column", 
              justifyContent: "flex-end", 
            }}
          >
            <div
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.8))",
                padding: "10px", 
                borderRadius: "10px", 
              }}
            >
              <div class="text-white p-3">
                <h2 class="card-title">Basketball Court</h2>
                <p>Shoot some hoops on our basketball court</p>
              </div>
            </div>
          </div>

          {/* card 7 Restaurant*/}
          <div
            className="relative grid md:grid-cols-2 mt-10 rounded-xl my-10"
            style={{
              backgroundImage: 'url("/assets/restaurant.jpg")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              width: "323px",
              height: "400px",
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.8))",
                padding: "10px", 
                borderRadius: "10px", 
              }}
            >
              <div class="text-white p-3">
                <h2 class="card-title">Restaurant</h2>
                <p>Savor delectable dishes at our on-site restaurant</p>
              </div>
            </div>
          </div>

          {/* card 8 Jogging*/}
          <div
            className="relative grid md:grid-cols-2 mt-10 rounded-xl my-10"
            style={{
              backgroundImage: 'url("/assets/jogging.jpg")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              width: "323px",
              height: "400px",
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "flex-end", 
            }}
          >
            <div
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.8))",
                padding: "10px", 
                borderRadius: "10px", 
              }}
            >
              <div class="text-white p-3">
                <h2 class="card-title">Jogging Area</h2>
                <p>Stay active with scenic jogs on our jogging track</p>
              </div>
            </div>
          </div>

        </div>
        {/* tutup div flex-wrap */}
        {/* tutup div return */}
      </div>
    );
  }
}
