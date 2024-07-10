import { Hero, Header, Footer } from "@components"
import { useState } from 'react';
import { VRP, CVRP, VRPTW } from "./forms";

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
        {
          option !== "" ? (
            <div className="mx-auto">
              {
                option === 'VRP' ? ( <VRP />) : option === 'CVRP' ? (<CVRP />) : (<VRPTW /> )
              }
            </div>
          ): null
        }
        <Footer />
      </div>
    </>
  )
}
