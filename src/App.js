import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Profile from './Profile';
import Posts from './Posts';
import Post from './Post';
import LeftSideBar from './LeftSideBar';
import Register from './Register';
import * as RB from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import './bubble.css';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      uname: '',
      pwd: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleUserNameChange(e) {
    this.setState({
      uname: e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      pwd: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.uname && this.state.pwd) {
      let credentials = {
        uname: this.state.uname,
        pwd: this.state.pwd
      }
      fetch('http://23.239.1.81:2999/login', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(credentials)
      })
      .then((res) => { return res.json() })
      .then((data) => {
        if (data.err_msg === 'OK') {
          this.props.doLogin(data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }

  render() {
    return (
      <div>
        <RB.Form inline onSubmit={this.handleSubmit}>
          <RB.FormGroup controlId="formInLineName">
          <span style={{marginRight:10}}><Link to="/">Home</Link></span>
            <RB.ControlLabel>Username</RB.ControlLabel>
            {' '}
            <RB.FormControl bsSize="sm" type="text" value={this.state.uname} onChange={this.handleUserNameChange} />
          </RB.FormGroup>
          {' '}
          <RB.FormGroup>
            {' '}
            <RB.ControlLabel>Password</RB.ControlLabel>
            {' '}
            <RB.FormControl bsSize="sm" type="password" value={this.state.pwd} onChange={this.handlePasswordChange} />
          </RB.FormGroup>
          {' '}
          <RB.Button type="submit">Login</RB.Button>
          <Link to="/register">Register</Link>
        </RB.Form>
      </div>
    )
  }
}

class Logout extends Component {
  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
    this.handleNameClick = this.handleNameClick.bind(this);
    this.handleHomeLinkClick = this.handleHomeLinkClick.bind(this);
  }

  handleLogout(e) {
    fetch('http://23.239.1.81:2999/logout', {
      method: 'GET',
      credentials: 'include'
    })
    .then((response) => { return response.json() })
    .then((responseJson) => {
        this.props.doLogout();
    }).catch((err) => {
      console.log(err);
    });
  }

  handleNameClick(e) {
    this.props.funcGreetingClick('profile');
  }

  handleHomeLinkClick(e) {
    this.props.funcGreetingClick('home');
  }

  render() {
    return(
      <div>
        <div>
          <span onClick={this.handleNameClick} className="uname">{this.props.user.uname}</span>{'  '}<span><Link to="/">Home</Link></span>{'  '}<RB.Button onClick={this.handleLogout}>Logout</RB.Button>
        </div>
      </div>
    )
  }
}

class Greeting extends Component {
  render() {
    if (this.props.isLoggedIn) {
      return (
        <RB.Navbar.Form pullRight>
          <Logout funcGreetingClick={this.props.funcGreetingClick} user={this.props.user} doLogout={this.props.funcLogout} />
        </RB.Navbar.Form>
      )
    } else {
      return (
        <RB.Navbar.Form pullRight>
          <Login funcGreetingClick={this.props.funcGreetingClick} doLogin={this.props.funcLogin} />
        </RB.Navbar.Form>
      )
    }
  }
}

class Main extends Component {
  render() {
    return (
      <div>
        <Posts isLoggedIn={this.props.isLoggedIn} user={this.props.user} />
      </div>
    )    
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn:false,
      user: null,
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleGreetingClick = this.handleGreetingClick.bind(this);
  }

  componentWillMount() {
    fetch('http://23.239.1.81:2999/checksession', {
      method: 'GET',
      credentials: 'include'
    })
    .then((response) => {
        return response.json();
    })
    .then((responseJson) => {
        if (responseJson.ok === 1) {
          this.setState({
            isLoggedIn: true,
            user: responseJson.user
          });
        } else {
          this.setState({
            isLoggedIn: false
          });
        }
    })
    .catch((err) => {
      console.error(err);
    });
  }

  handleLogout() {
    this.setState({
      isLoggedIn: false,
      user:null 
    });
  }

  handleLogin(user) {
    this.setState({
      isLoggedIn: true,
      user: user
    });
  }

  handleGreetingClick(what) {
  }

  render() {
    return (
      <div className="App">
        <RB.Navbar fixedTop={true}>
          <RB.Navbar.Header>
            <Link to="/"><img onClick={this.handleLogoClick} src={logo} className="App-logo" alt="logo" /></Link>
            <span onClick={this.handleLogoClick} className="logoText">Nanny Review</span>
          </RB.Navbar.Header>
            <Greeting funcGreetingClick={this.handleGreetingClick} user={this.state.user} isLoggedIn={this.state.isLoggedIn} funcLogout={this.handleLogout} funcLogin={this.handleLogin} />
        </RB.Navbar>
        <RB.Col md={2}></RB.Col>
        <RB.Col md={2}>
          <LeftSideBar user={this.state.user} isLoggedIn={this.state.isLoggedIn} />
        </RB.Col>
        <RB.Col md={5} style={{backgroundColor:'red'}}>
          <div className="panel">
            <Route exact={true} path="/" render={()=><Main isLoggedIn={this.state.isLoggedIn} user={this.state.user} />} />
            <Route exact={true} path="/profile" render={()=><Profile isLoggedIn={this.state.isLoggedIn} user={this.state.user} />} />
            <Route exact={true} path="/profile/:user" render={(props)=><Profile match={props} isLoggedIn={this.state.isLoggedIn} user={this.state.user} />} />
            <Route path="/post/:postid" render={(props)=><Post match={props} isLoggedIn={this.state.isLoggedIn} user={this.state.user} />} />
            <Route exact={true} path="/register" component={Register} />
          </div>
        </RB.Col>
        <RB.Col md={1}></RB.Col>
        <RB.Col md={2}></RB.Col>
      </div>
    );
  }
}

export default App;
