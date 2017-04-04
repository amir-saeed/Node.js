import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import Auth from '../modules/Auth';


const Base = ({ children }) => (
  <div>
    <div className="top-bar">
      {Auth.isUserAuthenticated() ? (
        <div className="top-bar-right">
          <Link to="/logout">Log out</Link>
           {/*<Link to="/analyst" activeClassName="active">Analyst</Link>*/}
           <Link to="/admin" activeClassName="active">Admin</Link>
        </div>
      ) : (
        <div className="top-bar-right">
          {/*<Link to="/login">Log in</Link>*/}
        </div>
      )}
    </div>

    { /* child component will be rendered here */ }
    {children}

  </div>
);

Base.propTypes = {
  children: PropTypes.object.isRequired
};

export default Base;
