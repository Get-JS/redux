import React from "react";

import Navbar from "../Navbar";

function Foundation({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

export default Foundation;
