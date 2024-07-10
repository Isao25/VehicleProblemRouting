import React, { useState } from 'react';

export const Select = ({ option, onOptionChange }) => {
  const [localOption, setLocalOption] = useState(option);

  const handleChange = (event) => {
    setLocalOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (localOption) {
      onOptionChange(localOption);
    } else {
      alert('Por favor seleccione una opción');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-2">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <div className="w-full mx-auto">
          <label htmlFor="select" className="block text-sm font-medium text-gray-700">
            Seleccione una opción
          </label>
          <select
            id="select"
            value={localOption}
            onChange={handleChange}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="" disabled>Seleccione una opción...</option>
            <option value="VRP">VRP</option>
            <option value="CVRP">CVRP</option>
            <option value="VRPTW">VRPTW</option>
          </select>
        </div>
        <button
          type="submit"
          className="block px-5 py-3 font-medium rounded-md tracking-wide text-center text-white capitalize transition-colors duration-300 transform bg-accent rounded-md hover:bg-accentHover focus:outline-none focus:ring focus:ring-focusRing focus:ring-opacity-80"
        >
          Comencemos
        </button>
      </form>
      <p className="mt-2 text-sm text-gray-600 text-center">
        Elige una de las variantes del problema de ruteo vehicular
      </p>
    </div>
  );
};
