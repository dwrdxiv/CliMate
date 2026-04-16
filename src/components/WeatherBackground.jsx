import React from "react";
import './WeatherBackground.css';

const WeatherBackground = ({ condition }) => {
    // Aquí puedes decidir qué elementos mostrar según la condición
    // condition vendrá de la API (ej: "Clear", "Clouds", "Rain")

    return (
      <div className={`sky-container ${condition?.toLowerCase()}`}>
        {/* El sol solo sale si está despejado o pocas nubes */}
        {(condition === "Clear" || condition === "Clouds") && (
          <div className="sun"></div>
        )}

        {/* Las nubes pueden variar en cantidad según la condición */}
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        {condition === "Clouds" && <div className="cloud cloud-3"></div>}

        <div className="grass-ground"></div>
      </div>
    );
};

export default WeatherBackground;