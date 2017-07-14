import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import Config from './config';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      uname: '',
      email: '',
      pwd1: '',
      pwd2: '',
      saving: false,
      userNameTaken: false,
      typingTimeout: 0
    }
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePwd1Change = this.handlePwd1Change.bind(this);
    this.handlePwd2Change = this.handlePwd2Change.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.checkUserName = this.checkUserName.bind(this);
  }

  handleRegister() {
    if (this.state.pw1 === this.state.pw2 && !this.state.userNameTaken) {
      this.setState({
        saving: true
      })
      fetch(Config.default.host+'register',
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({uname: this.state.uname, email: this.state.email, pwd: this.state.pwd1})
          }
      )
      .then((result) => {
          this.setState({
            saving: false
          })
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          saving: false
        })
      });
    }
  }

  handleUserNameChange(e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout)
    }
    let uname = e.target.value;
    this.setState({
      uname: e.target.value,
      typingTimeout: setTimeout(() => { this.checkUserName(uname) }, 750)
    });
  }

  checkUserName(uname) {
    if (uname.length > 1) {
      console.log('checkusername');
      fetch(Config.default.host+'checkname',
          {
            credentials: 'include',
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({uname: uname})
          }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        let res = true;
        if (resultJson.ok) {
          res = false;
        }
        this.setState({
          userNameTaken: res
        });
      })
      .catch((err) => {
        console.log(err);
      });

    }
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  handlePwd1Change(e) {
    this.setState({
      pwd1: e.target.value
    });
  }

  handlePwd2Change(e) {
    this.setState({
      pwd2: e.target.value
    });
  }

  render() {
    return (
      <div>
        <RB.Form>
          <RB.FormGroup>
            <RB.FormControl value={this.state.uname} type="text" placeholder="Desired Username (required)" onChange={this.handleUserNameChange} />
          </RB.FormGroup>
          {this.state.userNameTaken &&
            <span>{this.state.uname} has already been taken.</span>
          }
          <p>
            For the sake of anonymity, email is not required.  However, if you lose your password, you will not be able to recover your account.  NOTE:  You can always set your email after your have registered.
          </p>
          <RB.FormGroup>
            <RB.FormControl type="text" placeholder="Email (optional)" onChange={this.handleEmailChange} />
          </RB.FormGroup>
          <RB.FormGroup>
            <RB.FormControl type="password" placeholder="Password" onChange={this.handlePwd1Change} />
            <RB.FormControl type="password" placeholder="Passwordk Verification" onChange={this.handlePwd2Change} />
          </RB.FormGroup>
          {!this.state.saving &&
          <RB.Button onClick={this.handleRegister}>Register</RB.Button>
          }
        </RB.Form>
      </div>
    )
  }
}

export default Register;
