import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <section>
        <h1>Redux Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
          </div>
        </div>
      </section>
    </nav>
  );
}
export default Navbar;
