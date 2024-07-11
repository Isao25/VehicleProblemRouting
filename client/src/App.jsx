import { Hero, Header, Footer, Card } from "@components"
import { useState } from 'react';
import { VRP, CVRP, VRPTW } from "./forms";

const cardsInfo = [
  {
    id: 1,
    paso: "1. Marque puntos en el mapa",
    descripcion: "Selecciona en el mapa el punto que deseas marcar y presiona el botón verde."
  },
  {
    id: 2,
    paso: "2. Complete los campos",
    descripcion: "Llena los campos del formulario según el problema que quieras plantear."
  },
  {
    id: 3,
    paso: "3. ¡Listo!",
    descripcion: "Presiona 'Enviar' y espera los resultados."
  }
];

export const App = () => {
  const [option, setOption] = useState('');

  const handleOptionChange = (newOption) => {
    setOption(newOption);
  };

  return (
    <>
      <div className="w-full bg-gradient-to-r from-[#F2F2F2] to-[#E0E0E0] dark:from-[#1D1D1E] dark:to-[#101011] shadow-lg dark:shadow-[#101011] ">
        <Header />
        <Hero option={option} onOptionChange={handleOptionChange} />
        {option !== "" ? (
          <div>
            <div className="text-center py-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-black dark:text-white">
                ¡Listo para comenzar?
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Marca los puntos en el mapa y encuentra la mejor ruta.
              </p>
            </div>
            <div className="lg:grid sm:flex sm:flex-col gap-8 px-10 py-8 mx-auto my-4 rounded-lg shadow-xl dark:bg-darkSecundaryBg sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {cardsInfo.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </div>
            <div className="mx-auto">
              {option === 'VRP' ? (
                <VRP />
              ) : option === 'CVRP' ? (
                <CVRP />
              ) : (
                <VRPTW />
              )}
            </div>
          </div>
        ) : null}
        <Footer />
      </div>
    </>
  );
};