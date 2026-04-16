import React from 'react';
import './MainCard.css';

const MainCard = ({ data }) => {
  // Si no hay datos todavía, podemos mostrar un estado de carga
  if (!data) return (
  <div className="loading">
    <p className='Loading-text'>Looking outside</p>
  </div>);

  return (
    <main className="main-card">
      <h1 className="city-name">{data.name}, {data.sys.country}</h1>
      <div className="temp-container">
        <span className="temp-number">{Math.round(data.main.temp)}</span>
        <span className="temp-symbol">°</span>
      </div>
      
      <div className="extra-info-row">
        <div className="info-box">Humedad: {data.main.humidity}%</div>
        <div className="info-box">Viento: {data.wind.speed} km/h</div>
        <div className="info-box">Info 3: {data.wind.speed} km/h</div>
        <div className="info-box">Info 4: {data.wind.speed} km/h</div>
      </div>
    </main>
  );
};

export default MainCard;