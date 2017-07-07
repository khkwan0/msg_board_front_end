import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import './bubble.css';
import AvatarEditor from 'react-avatar-editor';

class PostAuthor extends Component {
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
      <span className="postAuthor" onClick={this.handleClick}>{this.props.authorName}</span>
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
      <p onClick={this.handleClick}>{this.props.postSubject}</p>
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
      if (this.props.chatStyle) {
        return (
          <div>
            {this.props.posts.map((item, idx) => {
              return (
                <RB.Row key={item._id}>
                  <RB.Col md={2}>
                    <div className="postAuthor">
                      <PostAuthor authorId={item.authord_id} authorName={item.author_name} /> said:
                    </div>
                  </RB.Col>
                  <RB.Col md={4}>
                    <div className="bubble postSubject">
                      <PostSubject postId={item._id} postSubject={item.subj} funcSetPostId={this.props.funcSetPostId} />
                    </div>
                  </RB.Col>
                </RB.Row>
              )
            })}
          </div>
        )
      } else {
        return (
          <div>
            <table>
              <thead>
                <tr><th>Who</th><th>When</th><th>What</th></tr>
              </thead>
              <tbody>
                {this.props.posts.map((item, idx) => {
                  return(
                    <tr key={item._id}>
                      <td className="post_author">
                        <PostAuthor authorId={item.author_id} authorName={item.author_name} />
                      </td>
                      <td>{item.ts}</td>
                      <td className="post_subject">
                        <PostSubject postId={item._id} postSubject={item.subj} funcSetPostId={this.props.funcSetPostId} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      }
    }
    return <div>Loading...</div>
  }
}

class Posts extends Component {
  render() {
    return (
      <div>
        <PostItems chatStyle={true} posts={this.props.posts} funcSetPostId={this.props.funcSetPostId} />
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
        <div>
          <RB.Form inline onSubmit={this.handleSubmit}>
            <RB.FormGroup controlId="formInLineName">
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
          </RB.Form>
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
        </div>
        <div>
          <span className="uname">{this.props.user.uname}</span>{' ' }<RB.Button onClick={this.handleLogout}>Logout</RB.Button>
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
          <Logout user={this.props.user} doLogout={this.props.funcLogout} />
        </RB.Navbar.Form>
      )
    } else {
      return (
        <RB.Navbar.Form pullRight>
          <Login doLogin={this.props.funcLogin} />
        </RB.Navbar.Form>
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
          <div className="postSubject">{this.state.post.subj}</div>
          <div className="postBody">{this.state.post.body}</div>
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

class ProfilePic extends Component {
  constructor(props) {
    super(props);
    let previewPic=this.props.profilePic?this.props.profilePic:'images/avatars/default.png';
    previewPic = 'http://23.239.1.81:2999/'+previewPic;
    let profilePic=this.props.profilePic?this.props.profilePic:'images/avatars/default.png';
    profilePic = 'http://23.239.1.81:2999/'+profilePic;
    this.state = {
      url: profilePic,
      file: '',
      tmpfile: '',
      newPicUrl: previewPic,
      editing: false,
      scale: 1,
      borderRadius: 100,
      height: 200,
      width: 200
    }
    this.handleNewPic = this.handleNewPic.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCrop = this.handleCrop.bind(this);
    this.handleScaleChange = this.handleScaleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleNewPic(e) {
    if (this.state.editing) {
      this.setState({
        editing: false,
        scale: 1.0,
        newPicUrl: this.state.url
      })
    } else {
      this.setState({
        editing: true
      })
      this.inputElement.click();
    }
  }

  handleSave(e) {
    if (this.editor.getImage()) {
      let data = new FormData();
      data.append('raw', this.editor.getImage().toDataURL());
      data.append('name', 'profile');
      if (this.state.tmpFile) {
        data.append('tmp_file', this.state.tmpFile);
      }
      fetch('http://23.239.1.81:2999/profile/save',
        {
          method: 'POST',
          body: data,
          credentials: 'include'
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        if (resultJson.status === 'OK') {
          this.setState({
            url: 'http://23.239.1.81:2999/'+resultJson.filename,
            tmpfile: '',
            editing:false,
            scale: 1.0,
            newPicUrl: 'http://23.239.1.81:2999/'+resultJson.filename
          })
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  handleChange(e) {
    if (e.target.value) {
      let data = new FormData();
      let files = this.inputElement.files;

      data.append('file', files[0]);
      fetch('http://23.239.1.81:2999/profile/upload',
        {
          method: 'POST',
          body: data,
          credentials: 'include'
        }
      )
      .then((result) => { return result.json() })
      .then((resultJson) => {
        this.setState({
          url: 'http://23.239.1.81:2999/'+resultJson.filename,
          tmpfile: resultJson.filename
        })
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  componentDidMount() {
    if (!this.state.url) {
      this.setState({
        url: 'http://23.239.1.81:2999/images/avatars/default.png'
      })
    }
  }

  handleCrop() {
    this.setState({
      newPicUrl: this.editor.getImage().toDataURL()
    })
  }

  handleScaleChange(e) {
    this.setState({
      scale: parseFloat(e.target.value),
      newPicUrl: this.editor.getImage().toDataURL()
    })
  }

  setEditorRef = (editor) => this.editor = editor;

  render() {
    let previewStyle = {
      borderRadius: this.state.borderRadius,
      borderWidth: 1,
      padding: 5,
      borderStyle: 'solid',
      width:this.state.width,
      height:this.state.height,
      borderColor: '#d3d3d3'
    }
    return(
      <RB.Grid>
        <RB.Col md={3}>
        {this.state.editing &&
          <div>
            <div>
              <AvatarEditor width={200} height={200} scale={this.state.scale} borderRadius={this.state.borderRadius} ref={this.setEditorRef} image={this.state.url} onPositionChange={this.handleCrop} />
            </div>
            <div style={{textAlign:'center'}}>
              <label>
                Zoom{' '}
                <input type="range" min="1" max="20" value={this.state.scale} step="0.2" onChange={this.handleScaleChange} />
              </label>
            </div>
          </div>
        }
        {!this.state.editing &&
          <div style={{textAlign:'center'}}>
            <img src={this.state.url} style={previewStyle} alt="profile_pic" />
          </div>
        }
          <div style={{textAlign: 'center'}}>
            <span onClick={this.handleNewPic}>Update Profile Pic</span>
            {this.state.editing && <span>  <RB.Button onClick={this.handleNewPic}>Cancel</RB.Button></span>}
          </div>
            <input ref={input => this.inputElement = input} className="hiddenFileDialog" type="file" onChange={this.handleChange} value={this.state.file} />
        </RB.Col>
        <RB.Col md={3}>
          {this.state.editing &&
            <div style={{textAlign:'center'}}>
              <div>
                <img src={this.state.newPicUrl} style={previewStyle} alt="preview" />
              </div>
              <div style={{marginTop:10}}>
                <RB.Button onClick={this.handleSave}>Save</RB.Button>
              </div>
            </div>
          }
        </RB.Col>
      </RB.Grid>
    )
  }


}

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    }
  }

  componentWillMount() {
    fetch('http://23.239.1.81:2999/getuser?uid='+this.props.user.id, {
      method: 'GET'
    })
    .then((response) => { return response.json() })
    .then((responseJson) => {
      this.setState({
        user: responseJson
      })
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <div>
      {this.state.user &&
        <div>
          <div>
            <ProfilePic profilePic={this.state.user.profileURL} />
          </div>
          <div>
            {this.state.user.uname}
          </div>
          <div>
          </div>
        </div>
      }
      </div>
    )
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
        chosenPostId: postId,
        viewState: 'post'
    })
  }

  render() {
    return (
      <div>
        {!this.state.chosenPostId && this.props.viewState === 'posts' &&
          <div>
            <div>
              {(this.props.isLoggedIn)?<CreatePostbox funcNewPost={this.handleNewPost} />:null}
            </div>
            <div>
              <Posts funcSetPostId={this.handleSetPostId} posts={this.state.posts} />
            </div>
          </div>
        } 
        {this.state.chosenPostId && this.props.viewState === 'posts' &&
          <Post postId={this.state.chosenPostId} isLoggedIn={this.props.isLoggedIn} />
        }
        {this.props.viewState === 'profile' &&
          <Profile isLoggedIn={this.props.isLoggedIn} user={this.props.user} />
        }.
      </div>
    )    
  }
}

class LeftSideBar extends Component {
  constructor() {
    super();
    this.handleUnameClick = this.handleUnameClick.bind(this);
  }

  handleUnameClick() {
    this.props.handleSideBarClick('profile');
  }

  render() {
    return (
      <div>
        {this.props.isLoggedIn?<div onClick={this.handleUnameClick} className="uname">{this.props.uname}</div>:<div></div>}
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn:false,
      user: {},
      viewState: 'posts'
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSideBarClick = this.handleSideBarClick.bind(this);
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
      isLoggedIn: false
    });
  }

  handleLogin(user) {
    this.setState({
      isLoggedIn: true,
      user: user
    });
  }

  handleSideBarClick(what) {
    this.setState({
      viewState: what
    });
  }

  render() {
    return (
      <div className="App">
        <RB.Navbar>
          <RB.Navbar.Header>
            <img src={logo} className="App-logo" alt="logo" />
            Nanny Review
          </RB.Navbar.Header>
            <Greeting user={this.state.user} isLoggedIn={this.state.isLoggedIn} funcLogout={this.handleLogout} funcLogin={this.handleLogin} />
        </RB.Navbar>
        <RB.Col md={2}></RB.Col>
        <RB.Col md={2}>
          <LeftSideBar handleSideBarClick={this.handleSideBarClick} uname={this.state.user.uname} isLoggedIn={this.state.isLoggedIn} />
        </RB.Col>
        <RB.Col md={5}><Main viewState={this.state.viewState} isLoggedIn={this.state.isLoggedIn} user={this.state.user} /></RB.Col>
        <RB.Col md={1}></RB.Col>
        <RB.Col md={2}></RB.Col>
      </div>
    );
  }
}

export default App;
