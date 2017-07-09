import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './App.css';
import './bubble.css';

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

class PostAuthor extends Component {
  render() {
    return(
      <span className="postAuthor"><Link to={`/profile/${this.props.authorId}`}>{this.props.authorName}</Link></span>
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
      <Link to={`/post/${this.state.postId}`}>{this.props.postSubject}</Link>
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
                  <RB.Col md={3}>
                    <div className="postTime">
                      <span>On </span><span>{item.ts}</span>
                    </div>
                    <div className="postAuthorContainer">
                      <span className="postAuthor"><PostAuthor authorId={item.author_id} authorName={item.author_name} /></span>{' '}<span>said:</span>
                    </div>
                  </RB.Col>
                  <RB.Col md={5}>
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
  constructor() {
    super();
    this.state = {
      posts:null
    }
    this.handleNewPost = this.handleNewPost.bind(this);
  }

  handleNewPost(newPost) {
    let posts = this.state.posts;
    posts.unshift(newPost);
    this.setState({
      posts: posts
    })
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

  render() {
    return (
      <div>
        <div>
          {(this.props.isLoggedIn)?<CreatePostbox funcNewPost={this.handleNewPost} />:null}
        </div>
        <div>
          <PostItems chatStyle={true} posts={this.state.posts} />
        </div>
      </div>
    );
  }
}

export default Posts;
