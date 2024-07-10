

export const Card = ({ item }) => (
    <div className="relative w-full flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="p-6">
        <h5 className="mb-2 font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 break-words">
          {item.paso}
        </h5>
        <p className="font-sans text-base font-light leading-relaxed text-inherit break-words">
          {item.descripcion}
        </p>
      </div>
    </div>
  );
