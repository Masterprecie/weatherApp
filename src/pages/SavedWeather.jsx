import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SavedWeather = () => {
	const savedWeather = JSON.parse(localStorage.getItem('savedWeather')) || [];
	console.log(savedWeather);

	const deleteLocation = (id) => {
		const updatedWeather = savedWeather.filter(result => result.id !== id);
		localStorage.setItem('savedWeather', JSON.stringify(updatedWeather));

		toast.success('Location deleted successfully!!!', {
			theme: "colored",
			position: 'top-right',
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
		window.location.reload();
	}

	return (
		<div className="bg-savedImg bg-cover w-full bg-no-repeat lg:h-[100vh] h-auto">
			<div className='absolute inset-0 bg-black opacity-70'></div>
			<div className="relative w-[80%] mx-auto pt-10">
				<div className='bg-white p-2 rounded-full w-[6%]'>
					<Link to='/'>
						<IoArrowBackCircleOutline size={50} />
					</Link>
				</div>
				<div className="text-center text-white pt-10 space-y-8 font-semibold">
					<p className='text-[40px]'>Saved Locations</p>
					<p className='text-base'>Find your Saved Locations here</p>
					{savedWeather.length === 0 && <p className='text-base'>You do not have a location saved yet. Your saved location will show up here when you save them.</p>}
					<div className="grid grid-cols-3 gap-5">
						{savedWeather.map((result) => {
							const { id, name, sys, main, wind, weather } = result
							const temperature = result.main.temp.toString().split('.')[0].slice(0, 2);

							return (


								<div key={id} className='bg-white text-black p-4 rounded-lg shadow-lg'>
									<h2 className="text-xl font-bold">{name}, {sys.country}</h2>
									<p className="text-lg">{temperature}°C</p>
									<p className="text-md">{weather[0].main}</p>
									<button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => deleteLocation(id)}>Delete</button>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

export default SavedWeather