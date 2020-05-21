import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import moment from 'moment';

const Footer = () => {
  const year = moment().year();

  return (
    <Fragment>
      <footer className="page-footer">
        <div className="footer-copyright">
          <a className="white-text created-by" target="_blank" href="https://twitter.com/NealDeters">Created By @nealdeters</a>
        </div>
      </footer>
    </Fragment>
  )
}

export default Footer;            