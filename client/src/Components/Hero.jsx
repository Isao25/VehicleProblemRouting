import { Select } from "@components"

export const Hero = ({ option, onOptionChange } ) => {
    return (
        <>
            <section className=" pt-16 pb-16 flex items-center min-h-screen justify-center bg-gradient-to-r from-[#F2F2F2] to-[#E0E0E0] dark:from-[#1D1D1E] dark:to-[#101011] ">
                <div className="mx-auto px-5 py-32 sm:max-w-[36rem] md:max-w-[48rem] bg-white rounded-lg shadow-xl dark:bg-darkSecundaryBg ">
                    <div className="text-center">
                        <p className="text-lg font-medium leading-8 text-accent"> Te presentamos</p>
                        <h1 className="mt-3 text-[3.5rem] font-bold leading-[4rem] tracking-tight text-black dark:text-white">
                            RouteSolver
                        </h1>
                        <p className="mt-3 text-lg leading-relaxed text-slate-400">
                        RouteSolver busca dar solución a las variantes del problema de ruteo vehicular
                        </p>
                    </div>
                    <div className="py-8" >
                        <Select option={option} onOptionChange={onOptionChange} />
                    </div>
                </div>
            </section>
        </>
    )
}
