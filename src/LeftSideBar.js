import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class LeftSideBar extends Component {
  render() {
    return (
      <div>
        {this.props.isLoggedIn &&
          <div>
            <Link to="/profile">{this.props.user.uname}</Link>
          </div>
        }
      </div>
    )
  }
}

export default LeftSideBar;
