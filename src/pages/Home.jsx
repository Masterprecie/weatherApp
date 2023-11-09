import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addSearchResult, deleteSearchResult } from "../store/weatherSlice";
import { IoMdSunny } from "react-icons/io";
import { BsFillCloudRainFill, BsFillTrash3Fill } from "react-icons/bs";
import { AiFillCloud } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../api/axios";
import Spinner from "../components/Spinner";

const Home = () => {
  const [search, setSearch] = useState("");
  const searchResults = useSelector((state) => state.weather.searchResults);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentWeather, setCurrentWeather] = useState([]);
  const [weatherCondition, setWeatherCondition] = useState(null);

  const currentDate = new Date();

  const formattedTime = currentDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const formattedDate = currentDate.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.get(
            `/weather?lat=${latitude}&lon=${longitude}&appid=${
              import.meta.env.VITE_APP_API_KEY
            }`
          );
          const currentWeatherLocation = response.data;
          setCurrentWeather([currentWeatherLocation]);
          setWeatherCondition(currentWeatherLocation.weather[0].main);
        } catch (error) {
          console.error("Error fetching weather data:", error);
          setError(
            "Failed to fetch current weather location. Please check your internet connection and try again."
          );
        } finally {
          setIsLoading(false);
        }
      });
    }
  }, []);

  const fetchWeatherByCityName = async (city) => {
    try {
      const response = await axios.get(
        `/weather?q=${city}&appid=${import.meta.env.VITE_APP_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search) {
      const result = await fetchWeatherByCityName(search);
      if (result) {
        dispatch(addSearchResult(result));
        const existingResults =
          JSON.parse(localStorage.getItem("searchResults")) || [];
        existingResults.push(result);
        localStorage.setItem("searchResults", JSON.stringify(existingResults));
        navigate(`/weatherdetails/${result.name}`);
      } else {
        toast.error("No result found...Try again!", {
          theme: "colored",
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const handleCancel = (name) => {
    dispatch(deleteSearchResult(name));

    const existingResults =
      JSON.parse(localStorage.getItem("searchResults")) || [];
    const updatedResults = existingResults.filter(
      (result) => result.name !== name
    );
    localStorage.setItem("searchResults", JSON.stringify(updatedResults));
  };
  const weatherIcon =
    weatherCondition === "Clear" ? (
      <IoMdSunny size={50} />
    ) : weatherCondition === "Clouds" ? (
      <AiFillCloud size={50} />
    ) : (
      <BsFillCloudRainFill size={50} />
    );

  console.log("arr:", currentWeather);

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div
          className={`bg-cover w-full lg:h-[100vh] h-full ${
            weatherCondition === "Clear"
              ? "bg-homeImg"
              : weatherCondition === "Clouds"
              ? "bg-cloudImg"
              : "bg-rainImg"
          }`}
        >
          <div className="absolute inset-0 bg-black opacity-70"></div>
          <div className="lg:grid grid-cols-12 relative ">
            <div className="col-span-8 text-white font-bold w-[80%] mx-auto flex flex-col justify-between py-16">
              <p className="text-2xl">Presh Weather</p>
              {currentWeather.map((data) => {
                const { id, weather, name } = data;
                const temperature = data.main.temp
                  .toString()
                  .split(".")[0]
                  .slice(0, 2);

                return (
                  <div
                    key={id}
                    className="lg:flex justify-between items-center text-center lg:text-left"
                  >
                    <div className="text-[100px] ">
                      <p>{temperature}°C</p>
                    </div>
                    <div className="pt-5">
                      <p className="text-2xl">{name}</p>

                      <p className="text-base">
                        {formattedTime} - {formattedDate},
                      </p>
                    </div>
                    <div className="text-xl pb-4">
                      <div className="pt-4 flex justify-center lg:block">
                        {weatherIcon}
                      </div>
                      <p className="capitalize">{weather[0].description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="col-span-4 w-full px-10 h-[100vh] bg-opacity-30 shadow-lg  py-16"
              style={{ background: "rgba(255,255,255,.15)" }}
            >
              <form>
                <div className="relative  ">
                  <input
                    placeholder="Search for a City"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border bg-white outline-0 rounded-lg py-2 pl-2"
                  />

                  <button
                    onClick={handleSearch}
                    className="text-white p-2 top-1 text-xs right-1 rounded-md absolute bg-blue-500"
                  >
                    Search
                  </button>
                </div>
              </form>

              <div>
                <p className="text-white font-semibold pt-5">
                  Your Previous Searches
                </p>
                <div className=" space-y-3 h-[20vh]  custom-scroll overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.name}
                      className="flex justify-between items-center"
                    >
                      <p className="text-white font-medium">
                        <Link to={`/weatherdetails/${result.name}`}>
                          {result.name}
                        </Link>
                      </p>
                      <p
                        onClick={() => handleCancel(result.name)}
                        className="bg-gray-300 cursor-pointer text-red-500 font-bold p-1 rounded-md px-2"
                      >
                        <BsFillTrash3Fill />
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t-4 border-gray-200 text-white font-semibold">
                <p className="py-5">Current Location Weather Details</p>
                {currentWeather.map((data) => {
                  const { id, wind, main } = data;
                  const temperature = data.main.temp
                    .toString()
                    .split(".")[0]
                    .slice(0, 2);
                  return (
                    <div key={id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p>Humidity</p>
                        <p>{main.humidity}%</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Temperature</p>
                        <p>{temperature}°C</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Wind Speed</p>
                        <p>{wind.speed} m/s</p>
                      </div>
                    </div>
                  );
                })}

                <button className="text-blue-500 mt-5 hover:shadow-lg py-3 px-8 hover:border-0 hover:text-white hover:bg-blue-700 duration-700 transition-all ease-in-out font-semibold bg-white p-3 border border-blue-500 rounded-sm ">
                  <Link to="/savedweather">View Saved Location</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
