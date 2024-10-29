// src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import { Oval } from 'react-loader-spinner';
import './App.css';

function Grp204WeatherApp() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({ loading: false, data: {}, error: false });
  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);

  const toDateFunction = () => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const currentDate = new Date();
    return `${weekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
  };

  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setWeather({ ...weather, loading: true });

      const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';
      const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
      const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

      try {
        const weatherRes = await axios.get(weatherUrl, { params: { q: input, units: 'metric', appid: apiKey } });
        setWeather({ data: weatherRes.data, loading: false, error: false });

        const forecastRes = await axios.get(forecastUrl, { params: { q: input, units: 'metric', appid: apiKey } });
        setForecast(forecastRes.data.list);
      } catch (error) {
        setWeather({ ...weather, data: {}, error: true, loading: false });
      }
    }
  };

  const addToFavorites = () => {
    if (!favorites.includes(weather.data.name)) {
      const updatedFavorites = [...favorites, weather.data.name];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const handleFavoriteClick = (city) => {
    setInput(city);
    setWeather({ ...weather, loading: true });
  };

  return (
    <div className="App">
      <header>
        <h1>Application Météo grp204</h1>
        <nav>
          <a href="#home">Accueil</a>
          <a href="#about">À propos</a>
          <button className="login-button">Connexion</button>
        </nav>
      </header>

      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Entrez le nom de la ville..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search}
        />
        <button onClick={addToFavorites} className="favorite-button">Ajouter aux Favoris</button>
      </div>

      <div className="favorites-list">
        <h3>Villes Favorites</h3>
        <ul>
          {favorites.map((city, index) => (
            <li key={index} onClick={() => handleFavoriteClick(city)}>{city}</li>
          ))}
        </ul>
      </div>

      {weather.loading && <Oval color="black" height={100} width={100} />}

      {weather.error && (
        <span className="error-message">
          <FontAwesomeIcon icon={faFrown} />
          <span>Ville introuvable</span>
        </span>
      )}

      {weather.data && weather.data.main && (
        <div className="weather-info">
          <h2>{weather.data.name}, {weather.data.sys.country}</h2>
          <span>{toDateFunction()}</span>
          <img src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`} alt={weather.data.weather[0].description} />
          <p>{Math.round(weather.data.main.temp)}°C</p>
          <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
        </div>
      )}

      <div className="forecast">
        {forecast.length > 0 && <h3>Prévisions Météo pour les 5 prochains jours</h3>}
        <div className="forecast-cards">
          {forecast.slice(0, 5).map((day, index) => (
            <div key={index} className="forecast-card">
              <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
              <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt={day.weather[0].description} />
              <p>{Math.round(day.main.temp)}°C</p>
            </div>
          ))}
        </div>
      </div>

      <footer>
        <p>&copy; 2024 Application Météo grp204. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default Grp204WeatherApp;
