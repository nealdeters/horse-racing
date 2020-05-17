import React, { Fragment } from 'react';
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <Fragment>
      <nav>
        <div className="nav-wrapper">
          <Link to="/"
            className="brand-logo">DERBY</Link>
          <a
            href="#"
            data-target="mobile-demo" 
            className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </a>
          <ul className="right hide-on-med-and-down">
           <li><Link to="/standings">Standings</Link></li>
          </ul>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo">
        <li><Link to="/standings">Standings</Link></li>
      </ul>
    </Fragment>
  )
}

export default Navigation;