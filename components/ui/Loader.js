import React from "react";

const Loader = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <video autoPlay loop muted playsInline className="w-1/2 h-1/2">
        <source src="/videos/Loader.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default Loader;
