import './App.css'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import SavedWeather from './pages/SavedWeather'
import WeatherDetails from './pages/WeatherDetails'
import { ToastContainer } from 'react-toastify'


const App = () => {

  return (
    <div>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/savedweather' element={<SavedWeather />} />
        <Route path='/weatherdetails/:cityName' element={<WeatherDetails />} />
      </Routes>
      <ToastContainer />
    </div >

  )
}

export default App


