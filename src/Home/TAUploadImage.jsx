import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

export default class TAUploadImage extends Component {
  constructor(props) {
    super(props);
    console.log('props', this.props);
    this.state = {
      saltedImageName: '',
      show: false,
      modal: false,
      photo_url: null,
      imageList: [],
      image: null,
      type: 'image',
    };
  }

  onPhotoClick = (e) => {
    console.log('this is the E: ', e);
    this.setState({ photo_url: e });

    this.setState({ border: !this.state.border });
  };

  onChange = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      console.log(image.name);
      this.setState({ image: image });
    }
  };

  onClickUpload = () => {
    if (this.state.image === null) {
      alert('Please select an image to upload');
      return;
    }
    const salt = Math.floor(Math.random() * 9999999999);
    let image_name = this.state.image.name;
    image_name = image_name + salt.toString();
    this.setState({ saltedImageName: image_name });
    this.setState({ photo_url: URL.createObjectURL(this.state.image) });
    console.log(this.state);
  };

  onClickConfirm = () => {
    let toggle = this.state.modal;
    //let hide = this.state.show;
    this.setState({ modal: !toggle });
    this.setState({ show: !toggle });
    this.props.setPhotoUrl(this.state.photo_url);
  };

  onHandleShowClick = () => {
    let url = BASE_URL + 'getPeopleImages/';
    let imageList = [];
    axios
      .get(url + this.props.currentUserId)
      .then((response) => {
        imageList = response.data.result;
        console.log(imageList);
        this.setState({ imageList: imageList });
      })
      .catch((err) => {
        console.log('Error getting images list', err);
      });

    let toggle = this.state.show;
    this.setState({ show: !toggle });
  };

  onUploadImage = () => {
    let toggle = this.state.modal;
    this.setState({ modal: !toggle });
  };

  onSubmitImage = () => {
    let toggle = this.state.show;
    this.setState({ show: !toggle });
    this.props.setPhotoUrl(this.state.photo_url);
    //this.props.parentFunction('', this.state.photo_url, this.state.type);
  };

  render() {
    var arrButtons = [];
    if (this.state.imageList.length > 0) {
      for (let i = 0; i < this.state.imageList.length; i++) {
        arrButtons.push(
          <button
            style={{
              borderRadius: '12px',
              margin: '5px',
              border:
                this.state.imageList[i].url === this.state.photo_url
                  ? '3px solid #FFB84D'
                  : '1px solid #FFB84D',
            }}
            onClick={(e) => this.onPhotoClick(this.state.imageList[i].url)}
          >
            <img
              style={{
                width: '100px',
                height: '70px',
              }}
              src={this.state.imageList[i].url}
            ></img>
          </button>
        );
      }
    }

    return (
      <>
        <Button
          variant="text"
          style={{
            textDecoration: 'underline',
            color: '#ffffff',
            fontSize: '14px',
            cursor: 'pointer',
          }}
          onClick={this.onHandleShowClick}
        >
          People Library
        </Button>
        <Modal show={this.state.show} onHide={this.onHandleShowClick}>
          <Modal.Header closeButton>
            <Modal.Title>Image List</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>
              <div></div>
              {arrButtons}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.onHandleShowClick}>
              Close
            </Button>
            {/* <Button variant="primary" onClick={this.onUploadImage}>
              Upload New Image
            </Button> */}

            {/* MODAL I WANT ON FIREBASE */}

            {/* <Modal show={this.state.modal} onHide={this.onUploadImage}>
              <Modal.Header closeButton>
                <Modal.Title>Upload Image</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <div>Upload Image</div>
                <input type="file" onChange={this.onChange} />
                <Button variant="dark" onClick={this.onClickUpload}>
                  Upload
                </Button>
                <img
                  src={
                    this.state.photo_url || 'http://via.placeholder.com/400x300'
                  }
                  alt="Uploaded images"
                  height="300"
                  width="400"
                />
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={this.onUploadImage}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.onClickConfirm}>
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal> */}

            {/* MODAL I WANT ON FIREBASE */}

            <Button variant="primary" onClick={this.onSubmitImage}>
              Select Image
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
