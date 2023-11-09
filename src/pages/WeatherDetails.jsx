import { useEffect, useState } from 'react';
import { AiFillCloud } from 'react-icons/ai'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { IoMdSunny } from 'react-icons/io'
import { BsFillCloudRainFill } from 'react-icons/bs'
import { Link, useParams } from 'react-router-dom'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../api/axios';

const WeatherDetails = () => {
	const { cityName } = useParams();
	const [weatherDetails, setWeatherDetails] = useState([])
	const [weatherCondition, setWeatherCondition] = useState(null)
	const currentDate = new Date()

	const formattedTime = currentDate.toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: false,
	});

	const formattedDate = currentDate.toLocaleString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
	useEffect(() => {
		const fetchWeatherDetails = async () => {
			try {
				const response = await axios.get(
					`/weather?q=${cityName}&appid=${import.meta.env.VITE_APP_API_KEY}`
				);
				const weatherData = response.data
				setWeatherDetails([weatherData]);
				setWeatherCondition(weatherData.weather[0].main)
			} catch (error) {
				console.error('Error fetching weather data:', error);
			}
		};
		fetchWeatherDetails()
	}, [cityName])

	console.log(cityName)



	const saveLocation = (weatherData) => {
		const existingWeather = JSON.parse(localStorage.getItem('savedWeather')) || [];
		const weatherDataExists = existingWeather.some(data => data.id === weatherData[0].id);

		if (!weatherDataExists) {
			existingWeather.push(...weatherData);
			localStorage.setItem('savedWeather', JSON.stringify(existingWeather));
			toast.success('Location Added Successfully!', {
				theme: "colored",
				position: 'top-right',
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} else {
			toast.warn('Location Already Exist!!!', {
				theme: "colored",
				position: 'top-right',
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	}
	const weatherIcon = weatherCondition === 'Clear' ? <IoMdSunny size={80} /> : weatherCondition === 'Clouds' ? <AiFillCloud size={80} /> : <BsFillCloudRainFill size={80} />;

	return (
		<div className={`bg-cover w-full lg:h-[100vh] h-full ${weatherCondition === 'Clear' ? 'bg-homeImg' : weatherCondition === 'Clouds' ? 'bg-cloudImg' : 'bg-rainImg'}`}>
			<div className='absolute inset-0 bg-black opacity-70'></div>
			<div className=" relative flex flex-col h-full py-10 items-center justify-center">
				<div className="relative shadow-2xl lg:w-[60%] w-[90%] lg:p-10 px-5 mx-auto text-white rounded-lg" style={{ backdropFilter: 'blur(10px)', background: 'rgba(184, 182, 182, 0.15)' }}>
					<div className='bg-white text-black p-2 rounded-full w-[9%]'>
						<Link to='/'>
							<IoArrowBackCircleOutline size={50} />
						</Link>
					</div>

					<div>
						{weatherDetails.map((result) => {
							const { id, name, sys, main, wind, weather } = result
							const temperature = result.main.temp.toString().split('.')[0].slice(0, 2);

							return (
								<div key={id}>
									<div className='lg:flex text-center lg:text-left items-center justify-between py-6 font-semibold'>
										<div>
											<p className="text-[40px] ">{name}, {sys.country}</p>
											<p className="text-base ">{formattedTime} - {formattedDate}</p>
										</div>

										<div>
											<button onClick={() => saveLocation(weatherDetails)} className='bg-blue-500 hover:shadow-lg py-3 px-8 text-white hover:bg-blue-700 duration-700 transition-all ease-in-out'>
												Save Location
											</button>
										</div>
									</div>
									<div className="lg:flex justify-center gap-5 mt-4 ">
										<div className='flex lg:justify-start justify-center gap-4 lg:border-r lg:pr-4 pr-0 border-r-0'>
											<div className='pt-4'>{weatherIcon}</div>
											<div className='font-semibold text-center'>
												<p className='text-[70px]'>{temperature}°C</p>
												<p className='text-base'>{weather[0].main}</p>
											</div>
										</div>

										<div className='space-y-8 pl-4'>
											<div className="flex lg:justify-start justify-center gap-4 font-semibold text-base">
												<div className='text-center'>
													<p className='text-[20px]'>{temperature}°C</p>
													<p>High</p>
												</div>
												<div className='text-center'>
													<p className='text-[20px]'>{wind.speed}mph</p>
													<p>Wind</p>
												</div>
												<div className='text-center'>
													<p className='text-[20px]'>{main.humidity}%</p>
													<p>Humidity</p>
												</div>
											</div>

											<div className="flex lg:justify-start justify-center gap-4 font-semibold text-base">
												<div className='text-center'>
													<p className='text-[20px]'>{temperature}°C</p>
													<p>Low</p>
												</div>
												<div className='text-center'>
													<p className='text-[20px]'>{main.pressure}in</p>
													<p>Pressure</p>
												</div>
												<div className='text-center'>
													<p className='text-[20px]'>70%</p>
													<p>Precipitation</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							)
						})}


						<div className='text-center mt-5'>
							<button className="text-blue-500 hover:shadow-lg py-3 px-8 hover:border-0 hover:text-white hover:bg-blue-700 duration-700 transition-all ease-in-out font-semibold bg-white p-3 border border-blue-500 rounded-sm ">
								<Link to='/savedweather'>
									View Saved Location
								</Link>
							</button>
						</div>
					</div>
				</div>

			</div>

		</div>
	)
}

export default WeatherDetails


