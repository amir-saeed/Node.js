
import React, { PropTypes } from 'react';
import LoginPage from '../containers/LoginPage.jsx';


var App = React.createClass({
  getInitialState() {
    return {email: ''}
  },
  handleChange(e) {
    this.setState({email: e.target.value})
  },
  render() {
    return <div>
      <input name="email" value={this.state.email} onChange={this.handleChange}/>
      <button type="button" disabled={!this.state.email}>Button</button>
    </div>
  }
});

export default LoginPage;

