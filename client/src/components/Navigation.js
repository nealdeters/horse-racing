import React, { Fragment } from 'react';
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <Fragment>
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper">
            <Link to="/"
              className="brand-logo">DRBY</Link>
            <Link
              to="/"
              data-target="mobile-demo" 
              className="sidenav-trigger">
              <i className="material-icons">menu</i>
            </Link>
            <ul className="right hide-on-med-and-down">
             <li><Link to="/schedule">Schedule</Link></li>
             <li><Link to="/standings">Standings</Link></li>
            </ul>
          </div>
        </nav>
      </div>

      <ul className="sidenav" id="mobile-demo">
        <li className="sidenav-close"><Link to="/schedule">Schedule</Link></li>
        <li className="sidenav-close"><Link to="/standings">Standings</Link></li>
      </ul>
    </Fragment>
  )
}

export default Navigation;