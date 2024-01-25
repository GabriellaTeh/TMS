import React, { useEffect } from "react";

function Header() {
  return (
    <>
      <header class="header-bar bg-primary mb-3">
        <div class="container d-flex flex-column flex-md-row align-items-center p-3">
          <h4 class="my-0 mr-md-auto font-weight-normal">
            <a href="/" class="text-white">
              TMS
            </a>
          </h4>
        </div>
      </header>
    </>
  );
}

export default Header;
