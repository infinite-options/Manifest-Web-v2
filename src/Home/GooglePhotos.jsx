import React, { useContext, useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import LoginContext from '../LoginContext';
import axios from 'axios';
import { Button, Container, Row, Col, Modal } from 'react-bootstrap';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

/* Navigation Bar component function */
export default function GooglePhotos(props) {
  const loginContext = useContext(LoginContext);
  var selectedUser = loginContext.loginState.curUser;
  if (
    document.cookie.split(';').some((item) => item.trim().startsWith('ta_uid='))
  ) {
    selectedUser = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ta_uid='))
      .split('=')[1];
  }

  var userID = '';
  var userTime_zone = '';
  var userEmail = '';
  var userPic = '';

  var userN = '';
  var taID = '';
  var taEmail = '';
  if (
    document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('patient_uid='))
  ) {
    //console.log('in there');
    userID = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_uid='))
      .split('=')[1];
    userTime_zone = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_timeZone='))
      .split('=')[1];
    userEmail = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_email='))
      .split('=')[1];
    userPic = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_pic='))
      .split('=')[1];
    userN = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_name='))
      .split('=')[1];
    taID = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ta_uid='))
      .split('=')[1];
    taEmail = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ta_email='))
      .split('=')[1];
  } else {
    // console.log('in here', console.log(loginContext.loginState));
    // console.log('document cookie', document.cookie);
    userID = loginContext.loginState.curUser;
    userEmail = loginContext.loginState.curUserEmail;
    userPic = loginContext.loginState.curUserPic;
    userN = loginContext.loginState.curUserName;
    if (loginContext.loginState.usersOfTA.length === 0) {
      userTime_zone = 'America/Tijuana';
    } else {
      userTime_zone = loginContext.loginState.usersOfTA[0].time_zone;
    }
    if (
      document.cookie
        .split(';')
        .some((item) => item.trim().startsWith('ta_uid='))
    ) {
      taID = document.cookie
        .split('; ')
        .find((row) => row.startsWith('ta_uid='))
        .split('=')[1];
      taEmail = document.cookie
        .split('; ')
        .find((row) => row.startsWith('ta_email='))
        .split('=')[1];
    }
    // console.log('curUser', userID);
    // console.log('curUser', userTime_zone);
    // console.log('curUser', userEmail);
  }

  let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
  useEffect(() => {
    if (BASE_URL.substring(8, 18) == 'gyn3vgy3fb') {
      // console.log('base_url', BASE_URL.substring(8, 18));
      CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE;
      CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_SPACE;
      // console.log(CLIENT_ID, CLIENT_SECRET);
    } else {
      // console.log('base_url', BASE_URL.substring(8, 18));
      CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_LIFE;
      CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_LIFE;
      // console.log(CLIENT_ID, CLIENT_SECRET);
    }
  });
  // console.log(CLIENT_ID, CLIENT_SECRET);

  const [id, setID] = useState([]);
  const [showViewPhotosModal, setShowViewPhotosModal] = useState(false);
  const [photoUrl, setPhotoUrl] = useState([]);

  const openViewPhotosModal = () => {
    setShowViewPhotosModal((prevState) => {
      return { showViewPhotosModal: !prevState.showViewPhotosModal };
    });
  };

  const closeViewPhotosModal = () => {
    setShowViewPhotosModal(false);
  };

  function GetUserAccessToken() {
    let url = BASE_URL + 'usersToken/';
    let user_id = userID;

    axios
      .get(url + user_id)
      .then((response) => {
        console.log('in events', response);

        var old_at = response['data']['google_auth_token'];
        var refreshToken = response['data']['google_refresh_token'];
        console.log('in events', old_at);
        const headers = {
          Accept: 'application/json',
          Authorization: 'Bearer ' + old_at,
        };
        const url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search';
        axios
          .post(
            url,
            {
              pageSize: '100',
              filters: {
                mediaTypeFilter: {
                  mediaTypes: ['PHOTO'],
                },
              },
            },
            {
              headers: headers,
            }
          )
          .then((response) => {
            console.log('google photos ', response.data.mediaItems);
            let mediaItems = response.data.mediaItems;
            let arr = [];
            if (mediaItems.length > 0) {
              mediaItems.map((items) => {
                arr.push({ baseUrl: items.baseUrl, id: items.id });
              });
              //setID(response.data.mediaItems['id']);
              console.log(arr);
              setID(arr);
              openViewPhotosModal();
            }
          })
          .catch((error) => console.log(error));
        fetch(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${old_at}`,
          {
            method: 'GET',
          }
        )
          .then((response) => {
            console.log('in events', response);
            if (response['status'] === 400) {
              console.log('in events if');
              let authorization_url =
                'https://accounts.google.com/o/oauth2/token';

              var details = {
                refresh_token: refreshToken,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'refresh_token',
              };

              var formBody = [];
              for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + '=' + encodedValue);
              }
              formBody = formBody.join('&');

              fetch(authorization_url, {
                method: 'POST',
                headers: {
                  'Content-Type':
                    'application/x-www-form-urlencoded;charset=UTF-8',
                },
                body: formBody,
              })
                .then((response) => {
                  return response.json();
                })
                .then((responseData) => {
                  console.log(responseData);
                  return responseData;
                })
                .then((data) => {
                  console.log(data);
                  let at = data['access_token'];
                  const headers = {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + at,
                  };
                  const url =
                    'https://photoslibrary.googleapis.com/v1/mediaItems:search';
                  axios
                    .post(
                      url,
                      {
                        pageSize: '100',
                        filters: {
                          mediaTypeFilter: {
                            mediaTypes: ['PHOTO'],
                          },
                        },
                      },
                      {
                        headers: headers,
                      }
                    )
                    .then((response) => {
                      console.log('google photos ', response.data.mediaItems);
                      let mediaItems = response.data.mediaItems;
                      let arr = [];
                      mediaItems.map((items) => {
                        arr.push({ baseUrl: items.baseUrl, id: items.id });
                      });
                      //setID(response.data.mediaItems['id']);
                      console.log(arr);
                      setID(arr);
                      openViewPhotosModal();
                    })
                    .catch((error) => console.log(error));

                  console.log('in events', at);
                  let updateURL = BASE_URL + 'UpdateUserAccessToken/';
                  axios
                    .post(updateURL + user_id, {
                      google_auth_token: at,
                    })
                    .then((response) => {})
                    .catch((err) => {
                      console.log(err);
                    });
                  return;
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              //setAccessToken(old_at);
            }
          })
          .catch((err) => {
            console.log(err);
          });
        console.log('in events', refreshToken);
      })
      .catch((error) => {
        console.log('Error in events' + error);
      });
  }
  const onPhotoClick = (e) => {
    console.log('this is the E: ', e);
    // setPhotoUrl(e);
    // const salt = Math.floor(Math.random() * 9999999999);
    // let image_name = image.name;
    // image_name = image_name + salt.toString();
    // setImageName(image_name);
    // setImageURL(URL.createObjectURL(image));
    setPhotoUrl(e);

    // this.setState({ border: !this.state.border });
  };
  const onSubmitImage = () => {
    props.setPhotoUrl(photoUrl);
    setShowViewPhotosModal(false);
    //this.props.parentFunction('', this.state.photo_url, this.state.type);
  };
  const viewPhotosModal = (id) => {
    // Custom styles
    const modalStyle = {
      position: 'absolute',
      zIndex: '5',
      left: '50%',
      top: '30%',
      transform: 'translate(50%, -50%)',
      width: '700px',
      color: '#D6B7FF',
    };
    const bodyStyle = {
      height: '300px',
      overflow: 'scroll',
    };

    return (
      <Modal.Dialog style={modalStyle}>
        <Modal.Header closeButton onHide={closeViewPhotosModal}>
          <Modal.Title>
            <h5 className="normalfancytext">Google Photos</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={bodyStyle}>
          <div>
            {id.length > 0 ? (
              <div>
                {id.map((id) => {
                  return (
                    <button
                      style={{
                        borderRadius: '12px',
                        margin: '5px',
                      }}
                      onClick={(e) => onPhotoClick(id.baseUrl)}
                    >
                      <img
                        style={{
                          width: '100px',
                          height: '70px',
                          objectFit: 'cover',
                        }}
                        src={id.baseUrl}
                        alt={id.baseUrl}
                      ></img>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Container>
            <Row>
              <Col>
                <button
                  style={{
                    width: '110px',
                    padding: '0',
                    margin: '0 20px',
                    backgroundColor: 'inherit',
                    border: '1px #D6B7FF solid',
                    borderRadius: '30px',
                    color: '#D6B7FF',
                    textAlign: 'center',
                  }}
                  onClick={closeViewPhotosModal}
                >
                  Cancel
                </button>
              </Col>
              <Col>
                <button
                  style={{
                    width: '110px',
                    padding: '0',
                    margin: '0 20px',
                    backgroundColor: 'inherit',
                    border: '1px #D6B7FF solid',
                    borderRadius: '30px',
                    color: '#D6B7FF',
                    textAlign: 'center',
                  }}
                  onClick={onSubmitImage}
                >
                  Select Image
                </button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal.Dialog>
    );
  };
  console.log('google photos', id);
  return (
    <div>
      <Button
        variant="text"
        style={{
          textDecoration: 'underline',
          color: '#000000',
          fontSize: '14px',
          textAlign: 'left',
        }}
        onClick={() => GetUserAccessToken()}
      >
        Upload from Google Photos
      </Button>
      <div>{showViewPhotosModal && viewPhotosModal(id)}</div>
    </div>
  );
}
