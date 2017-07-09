import React, { Component } from 'react';
import * as RB from 'react-bootstrap';
import AvatarEditor from 'react-avatar-editor';
import './App.css';

class ProfilePic extends Component {
  constructor(props) {
    super(props);
    let previewPic=this.props.profilePicURL?this.props.profilePicURL:'images/avatars/default.png';
    previewPic = 'http://23.239.1.81:2999/'+previewPic;
    let profilePic=this.props.profilePicURL?this.props.profilePicURL:'images/avatars/default.png';
    profilePic = 'http://23.239.1.81:2999/'+profilePic;
    this.state = {
      profilePicURL: profilePic,
      oldPicURL: profilePic,
      file: '',
      tmpfile: '',
      newPicURL: previewPic,
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
        profilePicURL: this.state.oldPicURL,
        newPicURL: this.state.oldPicURL
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
            profilePicURL: 'http://23.239.1.81:2999/'+resultJson.filename,
            tmpfile: '',
            editing:false,
            scale: 1.0,
            newPicURL: 'http://23.239.1.81:2999/'+resultJson.filename,
            oldPicURL: 'http://23.239.1.81:2999/'+resultJson.filename
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
          profilePicURL: 'http://23.239.1.81:2999/'+resultJson.filename,
          tmpfile: resultJson.filename
        })
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  handleCrop() {
    this.setState({
      newPicURL: this.editor.getImage().toDataURL()
    })
  }

  handleScaleChange(e) {
    this.setState({
      scale: parseFloat(e.target.value),
      newPicURL: this.editor.getImage().toDataURL()
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
              <AvatarEditor width={200} height={200} scale={this.state.scale} borderRadius={this.state.borderRadius} ref={this.setEditorRef} image={this.state.profilePicURL} onPositionChange={this.handleCrop} />
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
            <img src={this.state.profilePicURL} style={previewStyle} alt="profile_pic" />
          </div>
        }
          <div style={{textAlign: 'center'}}>
          {!this.state.editing && <span onClick={this.handleNewPic}>Update Profile Pic</span>}
            {this.state.editing && <span><RB.Button onClick={this.handleNewPic}>Cancel</RB.Button></span>}
          </div>
            <input ref={input => this.inputElement = input} className="hiddenFileDialog" type="file" onChange={this.handleChange} value={this.state.file} />
        </RB.Col>
        <RB.Col md={3}>
          {this.state.editing &&
            <div style={{textAlign:'center'}}>
              <div>
                <img src={this.state.newPicURL} style={previewStyle} alt="preview" />
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
  constructor(props) {
    super(props);
    this.props = props;
    console.log(this.props);

    let target = null;
    try {
      target = this.props.match.match.params.user;
    } catch(e) {
    }
    let self = true;
    try {
      if (this.props.user.id !== target.id)  {
        self = false
      }
    } catch(e) {
    }
    this.state = {
      user: this.props.user,
      self: self
    }
  }

  render() {
    return (
      <div>
      {this.state.user &&
        <div>
          <div>
            <ProfilePic editable={this.self} profilePicURL={this.state.user.profilePicURL} />
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

export default Profile;
