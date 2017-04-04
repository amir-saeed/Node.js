import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ModalPopup from './Modal.jsx';
import IPAddress from './IPAddress.jsx';

const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  user
}) => (
    <div className="container">
      <h1 className="card-heading">Kingfisher</h1>
      <h3>INTELLIGENT NETWORK SECURITY</h3>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <form className="login-form" action="/" onSubmit={onSubmit}>
        <a onClick={this.handleShowModal.bind(this)} className="help">?</a>
        {this.state.view.showModal ? <ModalPopup handleHideModal={this.handleHideModal.bind(this)} /> : null}  
     
        <div className="field-line">
          <p>Email</p>
          <input type="text"
            name="email"

            onChange={onChange}
            value={user.email}
          />
        </div>

        <div className="field-line">
          <p>Password</p>
          <input type="text"
            className="input-text"
            type="password"
            name="password"
            onChange={onChange}

            value={user.password}
          />
        </div>

        <div className="primary-black">
          <div className="secure-trail">
            <IPAddress />
          </div>
          <button className="primary-button" type="submit" label="SIGN IN">SIGN IN</button>
        </div>
      </form>
    </div>
  );

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

export default LoginForm;
