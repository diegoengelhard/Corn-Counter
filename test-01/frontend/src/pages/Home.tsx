import React from "react";
import Temp from "../components/Temp";

const Home = () => {
  return (
    <>
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="bg-emerald-500 p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-4xl font-bold text-white underline decoration-wavy">
            ¡Tailwind Funciona! 🚀
          </h1>
          <p className="text-white mt-4">
            ¡todo está configurado correctamente!
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
