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

class PostSubject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.postId
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.funcSetPostId(this.state.postId);
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
              <tr><th>Who</th><th>When</th><th>What</th></tr>
            </thead>
            <tbody>
              {this.props.posts.map((item, idx) => {
                return(
                  <tr key={item._id}>
                    <td className="post_author"><Postauthor authorId={item.author_id} authorName={item.author_name} /></td>
                    <td>{item.ts}</td>
                    <td className="post_subject"><PostSubject postId={item._id} postSubject={item.subj} funcSetPostId={this.props.funcSetPostId} /></td>
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
          <PostItems posts={this.props.posts} funcSetPostId={this.props.funcSetPostId} />
        </div>
      </div>
    );
  }
}

class CreatePostbox extends Component {
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
        post: this.state.postMsg,
        parent_id: 0
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

class PostComment extends Component {
  constructor() {
    super();
    this.state = {
      comment: '',
      saving: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.comment) {
      this.setState({
        saving:true
      })
      let newPost = {
        subj: 'Comment in reply to:',
        post: this.state.comment,
        parent_id: this.props.parentId
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
        this.props.liftNewComment(data);
        this.setState({
          saving:false,
          comment: ''
        })
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

  handleChange(e) {
    this.setState(
      {
        comment: e.target.value
      }
    );
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <textarea onChange={this.handleChange} value={this.state.comment}></textarea>
        </div>
        <div>
        {this.state.saving?<input type="submit" value="Comment" disabled />:<input type="submit" value="Comment" />}
        </div>
      </form>
    )
  }
}

class Comments extends Component {
  constructor() {
    super();
    this.state = {
      comments: []
    }
    this.fetchComments = this.fetchComments.bind(this);
  }

  fetchComments(postId) {
    if (postId) {
      fetch('http://23.239.1.81:2999/getcomments?postid=' + postId, 
        {
          method: 'GET',
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        this.setState({
          comments: resultJson
        })
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.postId !== this.props.postId) {
      this.fetchComments(nextProps.postId);
    }
    if (nextProps.newComment && (this.props.newComment === null || (nextProps.newComment._id !== this.props.newComment._id))) {
      let comments = this.state.comments;
      comments.push(nextProps.newComment);
      this.setState({
        comments: comments
      })
    }
  }

  componentDidMount() {
    this.fetchComments(this.props.postId);
  }

  render() {
    if (this.state.comments.length > 0) {
      return (
        <div>
          {this.state.comments.map((comment) => {
            return (
              <div key={comment._id + "_comment"}>{comment.body}</div>
            )
          })}
        </div>
      )
    }
    return null;
  }
}

class Post extends Component {
  constructor() {
    super();
    this.state = {
      post:null,
      newComment: null
    }
    this.handleNewComment = this.handleNewComment.bind(this);
    this.handleFetchPost = this.handleFetchPost.bind(this);
  }

  handleNewComment(comment) {
    console.log('handlenewcomment:'+ comment);
    this.setState({
        newComment: comment
    })
  }

  handleFetchPost(postId) {
    if (postId) {
      fetch('http://23.239.1.81:2999/getpost?postid='+postId,
        {
          method: 'GET'
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        this.setState({
          post: resultJson
        })
      })
      .catch((err) => {
        console.log(err)
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.postId !== this.props.postId) {
      this.handleFetchPost(nextProps.postId);
    }
  }

  componentDidMount() {
    this.handleFetchPost(this.props.postId);
  }

  render() {
    if (this.state.post) {
      return(
       <div>
        <div>
          <div>{this.state.post.author_name}</div>
          <div>{this.state.post.ts}</div>
          <div>{this.state.post.subj}</div>
          <div>{this.state.post.body}</div>
        </div>
        {(this.props.isLoggedIn)?(
        <div>
          <PostComment parentId={this.state.post._id} liftNewComment={this.handleNewComment} />
        </div>
        ):null}
        <div>
          <Comments postId={this.state.post._id} newComment={this.state.newComment} />
        </div>
       </div>
      )
    }
    return null;
  }
}

class Main extends Component {
  constructor() {
    super();
    this.state = {
      chosenPostId: null
    }
    this.handleNewPost = this.handleNewPost.bind(this);
    this.handleSetPostId = this.handleSetPostId.bind(this);
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

  handleSetPostId(postId) {
    this.setState({
        chosenPostId: postId
    })
  }

  render() {
    return (
      <div>
        <div>
          <div>
            {(this.props.isLoggedIn)?<CreatePostbox funcNewPost={this.handleNewPost} />:null}
          </div>
          <div>
            <Posts funcSetPostId={this.handleSetPostId} posts={this.state.posts} />
            {this.state.chosenPostId?<Post postId={this.state.chosenPostId} isLoggedIn={this.props.isLoggedIn} />:null}
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
