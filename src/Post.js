import React, { Component } from 'react';

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
  constructor(props) {
    super(props);
    let postId = null;
    if (typeof this.props.match !== 'undefined' && typeof this.props.match.match.params.postid !== 'undefined') {
      postId = this.props.match.match.params.postid;
    }
    console.log(postId);
    this.state = {
      post:null,
      newComment: null,
      postId: postId
    }
    this.handleNewComment = this.handleNewComment.bind(this);
    this.handleFetchPost = this.handleFetchPost.bind(this);
    this.handleFetchPost(postId);
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
    this.handleFetchPost(this.state.postId);
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
    return <div>Loading...</div>;
  }
}

export default Post;
