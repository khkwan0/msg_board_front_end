import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Postauthor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorId: this.props.authorId
    }
    this.handleClick = this.handleClick.bind(this);

  }

  handleClick(e) {
    console.log(this.state.authorId);
  }

  render() {
    return(
      <span onClick={this.handleClick}>{this.props.authorName}</span>
    )
  }
}

class Postsubject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.postId
    }
    this.handleClick = this.handleClick.bind(this);

  }

  handleClick(e) {
    console.log(this.state.postId);
    fetch('http://23.239.1.81:2999/getpost?postid='+this.state.postId, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'GET',
    })
    .then((res) => { return res.json() })
    .then((data) => {
      this.props.funcNewPost(data);
      this.setState({
        saving:false,
        postSubj: '',
        postMsg: ''
      })
    })
    .catch((err) => {
      console.log(err);
    });
    
  }

  render() {
    return(
      <span onClick={this.handleClick}>{this.props.postSubject}</span>
    )
  }
}

class PostItems extends Component {
  constructor() {
    super();
    this.handleAuthorClick = this.handleAuthorClick.bind(this);
    this.handleSubjClick = this.handleSubjClick.bind(this);
  }

  handleAuthorClick(e) {
    console.log(e.target);
  }

  handleSubjClick(e) {
    console.log(e.target);
  }

  render() {
    if (this.props && this.props.posts) {
      return(
        <div>
          <table>
            <thead>
              <tr><th>Who</th><th>Subject</th><th>When</th></tr>
            </thead>
            <tbody>
              {this.props.posts.map((item, idx) => {
                return(
                  <tr key={item._id}>
                    <td className="post_author"><Postauthor authorId={item.author_id} authorName={item.author_name} /></td>
                    <td className="post_subject"><Postsubject postId={item._id} postSubject={item.subj} /></td>
                    <td>{item.ts}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    }
    return <div>Loading...</div>
  }
}

class Posts extends Component {
  render() {
    return (
      <div>
        <div>
          <h2>Latest Posts</h2>
        </div>
        <div>
          <PostItems posts={this.props.posts} />
        </div>
      </div>
    );
  }
}

class Postbox extends Component {
  constructor() {
    super();
    this.state = {
      postSubj: '',
      postMsg: '',
      saving: false,
      error: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePostChange = this.handlePostChange.bind(this);
    this.handleSubjChange = this.handleSubjChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.postMsg && this.state.postSubj) {
      this.setState({
        saving:true
      })
      let newPost = {
        subj: this.state.postSubj,
        post: this.state.postMsg
      }
      fetch('http://23.239.1.81:2999/savepost', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(newPost)
      })
      .then((res) => { return res.json() })
      .then((data) => {
        this.props.funcNewPost(data);
        this.setState({
          saving:false,
          postSubj: '',
          postMsg: ''
        })
          /*
        if (data.err_msg === 'OK') {
        }
        */
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          saving:false,
          error: err
        })
      })
    } 
  }

  handlePostChange(e) {
    this.setState({
      postMsg:e.target.value
    });
  }

  handleSubjChange(e) {
    this.setState({
      postSubj:e.target.value
    });
  }

  render() {
    return(
      <div>
        <h2>Post Something here...</h2>
        <div>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label>
                Subject:
                <input type="text" value={this.state.postSubj} onChange={this.handleSubjChange} />
              </label>
            </div>
            <div>
              <label>
                Post:
                <textarea onChange={this.handlePostChange} value={this.state.postMsg}>
                </textarea>
              </label>
            </div>
            <div>
              {this.state.saving?<input type="submit" value="Saving" disabled />:<input type="submit" value="Post" />}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

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
          this.props.doLogin();
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
        <div>
          <h2>Welcome Guest!</h2>
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Username
              <input type="text" value={this.state.uname} onChange={this.handleUserNameChange} />
            </label>
            <label>
              Password
              <input type="password" value={this.state.pwd} onChange={this.handlePasswordChange} />
            </label>
            <input type="submit" value="Login" />
          </form>
        </div>
      </div>
    )
  }
}

class Logout extends Component {
  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
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
  render() {
    return(
      <div>
        <div>
          <h2>Welcome back!</h2>
        </div>
        <div>
          <button onClick={this.handleLogout}>Logout</button>
        </div>
      </div>
    )
  }
}

class Greeting extends Component {

  render() {
    if (this.props.isLoggedIn) {
      return (
        <div>
          <Logout doLogout={this.props.funcLogout} />
        </div>
      )
    } else {
      return (
        <div>
          <Login doLogin={this.props.funcLogin} />
        </div>
      )
    }
  }
}

class Main extends Component {
  constructor() {
    super();
    this.state = {
      posts: null
    }
    this.handleNewPost = this.handleNewPost.bind(this);
  }

  componentDidMount() {
    fetch('http://23.239.1.81:2999/getlatestposts')
    .then((response) => {
        return response.json();
    })
    .then((responseJson) => {
      responseJson.reverse();
      this.setState(
          {
            posts: responseJson
          }
      );
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleNewPost(newPost) {
    let posts = this.state.posts;
    posts.unshift(newPost);
    this.setState({
      posts: posts
    })
  }

  render() {
    return (
      <div>
        <div>
          <div>
            {(this.props.isLoggedIn)?<Postbox funcNewPost={this.handleNewPost}/>:null}
          </div>
          <div>
            <Posts posts={this.state.posts} />
          </div>
        </div>
      </div>
    )    
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn:false,
      user: {}
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
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
            isLoggedIn: true
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
      isLoggedIn: false
    });
  }

  handleLogin() {
    this.setState({
      isLoggedIn: true
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Greeting isLoggedIn={this.state.isLoggedIn} funcLogout={this.handleLogout} funcLogin={this.handleLogin} />
        </div>
        <div>
          <Main isLoggedIn={this.state.isLoggedIn} />
        </div>
      </div>
    );
  }
}

export default App;
