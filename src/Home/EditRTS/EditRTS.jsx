import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EditRTSContext from './EditRTSContext';
import axios from 'axios';

const EditRTS = () => {
  const editingRTSContext = useContext(EditRTSContext);

  const updateRTS = (e) => {
    e.stopPropagation();
    let object = { ...editingRTSContext.editingRTS.newItem };
    object.start_day_and_time = `${object.start_day} ${object.start_time}:00`;
    delete object.start_day;
    delete object.start_time;
    object.end_day_and_time = `${object.end_day} ${object.end_time}:00`;
    delete object.end_day;
    delete object.end_time;
    const numHours = object.numMins / 60;
    let numMins = object.numMins % 60;
    if (numMins < 10) numMins = '0' + numMins;
    object.expected_completion_time = `${numHours}:${numMins}:00`;
    delete object.numMins;
    object.id = editingRTSContext.editingRTS.id;
    object.user_id = editingRTSContext.editingRTS.user_id;
    object.ta_people_id = '';
    console.log(object);
    let formData = new FormData();
    Object.entries(object).forEach((entry) => {
      if (typeof entry[1].name == 'string') {
        formData.append(entry[0], entry[1]);
      } else if (entry[1] instanceof Object) {
        entry[1] = JSON.stringify(entry[1]);
        formData.append(entry[0], entry[1]);
      } else {
        formData.append(entry[0], entry[1]);
      }
    });
    axios
      .post(
        'https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateGR',
        formData
      )
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response);
        }
        console.log(err);
      });
  };

  return (
    <div
      style={{
        marginTop: '1rem',
        marginLeft: '5rem',
        marginRight: '3rem',
        backgroundColor: '#F57045',
        color: '#ffffff',
        font: 'SF-Compact-Text-Bold',
      }}
    >
      <Container
        style={{
          padding: '2rem',
        }}
      >
        <Row>
          <Col>
            <div>
              <h1
                style={{ fontSize: '24px', font: 'SF-Compact-Text-Semibold' }}
              >
                Routine Name
              </h1>
              <input
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: 'none',
                  padding: '3px',
                  outline: 'none',
                }}
                value={editingRTSContext.editingRTS.newItem.title}
                onChange={(e) => {
                  editingRTSContext.setEditingRTS({
                    ...editingRTSContext.editingRTS,
                    newItem: {
                      ...editingRTSContext.editingRTS.newItem,
                      title: e.target.value,
                    },
                  });
                }}
              />
            </div>
          </Col>
          <Col>
            <h1 style={{ fontSize: '24px', font: 'SF-Compact-Text-Semibold' }}>
              Start Time
            </h1>
            <input
              style={{
                width: '30%',
                borderRadius: '8px',
                border: 'none',
                marginRight: '20px',
                padding: '3px',
                outline: 'none',
              }}
              type="date"
              value={editingRTSContext.editingRTS.newItem.start_day}
              onChange={(e) => {
                editingRTSContext.setEditingRTS({
                  ...editingRTSContext.editingRTS,
                  newItem: {
                    ...editingRTSContext.editingRTS.newItem,
                    start_day: e.target.value,
                  },
                });
              }}
            />
            <input
              style={{
                width: '30%',
                borderRadius: '8px',
                border: 'none',
                padding: '3px',
                outline: 'none',
              }}
              type="time"
              value={editingRTSContext.editingRTS.newItem.start_time}
              onChange={(e) => {
                editingRTSContext.setEditingRTS({
                  ...editingRTSContext.editingRTS,
                  newItem: {
                    ...editingRTSContext.editingRTS.newItem,
                    start_time: e.target.value,
                  },
                });
              }}
            />
          </Col>
          <Col>
            <h1 style={{ fontSize: '24px', font: 'SF-Compact-Text-Semibold' }}>
              End Time
            </h1>
            <input
              style={{
                width: '30%',
                marginRight: '20px',
                borderRadius: '8px',
                border: 'none',
                padding: '3px',
                outline: 'none',
              }}
              type="date"
              value={editingRTSContext.editingRTS.newItem.end_day}
              onChange={(e) => {
                editingRTSContext.setEditingRTS({
                  ...editingRTSContext.editingRTS,
                  newItem: {
                    ...editingRTSContext.editingRTS.newItem,
                    end_day: e.target.value,
                  },
                });
              }}
            />
            <input
              style={{
                width: '30%',
                borderRadius: '8px',
                border: 'none',
                padding: '3px',
                outline: 'none',
              }}
              type="time"
              value={editingRTSContext.editingRTS.newItem.end_time}
              onChange={(e) => {
                editingRTSContext.setEditingRTS({
                  ...editingRTSContext.editingRTS,
                  newItem: {
                    ...editingRTSContext.editingRTS.newItem,
                    end_time: e.target.value,
                  },
                });
              }}
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col md={4}>
            <Row>
              <Col>
                <h1
                  style={{ fontSize: '24px', font: 'SF-Compact-Text-Semibold' }}
                >
                  Change Icon
                </h1>
                <div
                  style={{
                    fontSize: '16px',
                    textDecoration: 'underline',
                  }}
                >
                  Add icon to library
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    textDecoration: 'underline',
                  }}
                >
                  Use icon from library
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    textDecoration: 'underline',
                  }}
                >
                  User's library
                </div>
              </Col>
              <Col>
                {/* <img alt="icon" src="ac" /> */}
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                  }}
                ></div>
              </Col>
            </Row>
          </Col>
          <Col md={8}>
            <h1 style={{ fontSize: '24px', font: 'SF-Compact-Text-Semibold' }}>
              This Takes Me
            </h1>
            <div>
              <input
                style={{
                  border: 'none',
                  borderRadius: '8px',
                  padding: '3px',
                  outline: 'none',
                }}
                type="number"
                value={editingRTSContext.editingRTS.newItem.numMins}
                onChange={(e) => {
                  editingRTSContext.setEditingRTS({
                    ...editingRTSContext.editingRTS,
                    newItem: {
                      ...editingRTSContext.editingRTS.newItem,
                      numMins: e.target.value,
                    },
                  });
                }}
              />
              <span
                style={{ fontSize: '24px', font: 'SF-Compact-Text-Semibold' }}
              >
                {' '}
                Minutes{' '}
              </span>
            </div>
          </Col>
        </Row>
        <br />
        <hr style={{ borderColor: 'white' }} />
        <br />
        <Row>
          <Col md={8}>
            <h1 style={{ fontSize: '24px', font: 'SF-Compact-Text-Semibold' }}>
              Repeating Options
            </h1>

            <Row>
              <Col md={6} style={{ margin: '10px 0' }}>
                <div>
                  Repeat Every
                  <input
                    type="number"
                    style={{
                      width: '60px',
                      borderRadius: '8px',
                      border: 'none',
                      margin: ' 0 5px',
                      padding: '3px',
                      outline: 'none',
                    }}
                    value={editingRTSContext.editingRTS.newItem.repeat_every}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat_every: e.target.value,
                        },
                      });
                    }}
                  />
                  Days
                </div>
                <div style={{ margin: '10px 0' }}>
                  Does not repeat
                  <input
                    style={{
                      padding: '3px',
                      outline: 'none',
                      margin: ' 0 5px',
                      width: '1.3em',
                      height: '1.3em',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      verticalAlign: 'middle',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    name="repeating"
                    type="checkbox"
                    checked={editingRTSContext.editingRTS.newItem.repeat}
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          repeat: e.target.checked,
                        },
                      });
                    }}
                  />
                </div>
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={3}>
                    <div style={{ fontSize: '18px' }}> Ends </div>
                  </Col>
                  <Col md={9}>
                    <div style={{ margin: '10px 0' }}>
                      <input
                        style={{
                          padding: '3px',
                          outline: 'none',
                          margin: ' 0 5px',
                          width: '1.3em',
                          height: '1.3em',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          verticalAlign: 'middle',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        name="repeatingEnd"
                        type="radio"
                        value="On"
                        onChange={(e) => {
                          editingRTSContext.setEditingRTS({
                            ...editingRTSContext.editingRTS,
                            newItem: {
                              ...editingRTSContext.editingRTS.newItem,
                              repeat_type: e.target.value,
                            },
                          });
                        }}
                      />
                      On
                      <input
                        style={{
                          width: '65%',
                          borderRadius: '8px',
                          border: 'none',
                          marginLeft: '15px',
                          padding: '3px',
                          outline: 'none',
                        }}
                        type="date"
                        value={
                          editingRTSContext.editingRTS.newItem.repeat_ends_on
                        }
                        onChange={(e) => {
                          editingRTSContext.setEditingRTS({
                            ...editingRTSContext.editingRTS,
                            newItem: {
                              ...editingRTSContext.editingRTS.newItem,
                              repeat_ends_on: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                    <div style={{ margin: '10px 0' }}>
                      <input
                        style={{
                          padding: '3px',
                          outline: 'none',
                          margin: ' 0 5px',
                          width: '1.3em',
                          height: '1.3em',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          verticalAlign: 'middle',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        name="repeatingEnd"
                        type="radio"
                        value="occurences"
                        onChange={(e) => {
                          editingRTSContext.setEditingRTS({
                            ...editingRTSContext.editingRTS,
                            newItem: {
                              ...editingRTSContext.editingRTS.newItem,
                              repeat_type: e.target.value,
                            },
                          });
                        }}
                      />
                      After
                      <input
                        style={{
                          width: '50px',
                          borderRadius: '5px',
                          border: 'none',
                          margin: '5px 10px',
                        }}
                        type="number"
                        value={
                          editingRTSContext.editingRTS.newItem.repeat_occurences
                        }
                        onChange={(e) => {
                          editingRTSContext.setEditingRTS({
                            ...editingRTSContext.editingRTS,
                            newItem: {
                              ...editingRTSContext.editingRTS.newItem,
                              repeat_occurences: e.target.value,
                            },
                          });
                        }}
                      />
                      Occurences
                    </div>
                    <div style={{ margin: '10px 0' }}>
                      <input
                        style={{
                          padding: '3px',
                          outline: 'none',
                          margin: ' 0 5px',
                          width: '1.3em',
                          height: '1.3em',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          verticalAlign: 'middle',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        name="repeatingEnd"
                        type="radio"
                        value="Never"
                        onChange={(e) => {
                          editingRTSContext.setEditingRTS({
                            ...editingRTSContext.editingRTS,
                            newItem: {
                              ...editingRTSContext.editingRTS.newItem,
                              repeat_type: e.target.value,
                            },
                          });
                        }}
                      />
                      Never Ends
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col md={4}>
            <h1 style={{ fontSize: '24px', font: 'SF-Compact-Text-Semibold' }}>
              Location
            </h1>
            <div style={{ margin: '10px 0' }}>
              <input
                style={{
                  width: '100%',
                  borderRadius: '5px',
                  border: 'none',
                  marginBottom: '5px',
                  padding: '3px 10px',
                }}
                placeholder="Bathroom / Kitchen / Garden"
                value={editingRTSContext.editingRTS.newItem.location}
                onChange={(e) => {
                  editingRTSContext.setEditingRTS({
                    ...editingRTSContext.editingRTS,
                    newItem: {
                      ...editingRTSContext.editingRTS.newItem,
                      location: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <span> Available to User </span>
            <input
              style={{
                padding: '3px',
                outline: 'none',
                margin: ' 0 30px',
                width: '1.3em',
                height: '1.3em',
                backgroundColor: 'white',
                borderRadius: '50%',
                verticalAlign: 'middle',
                border: 'none',
                cursor: 'pointer',
              }}
              type="checkbox"
              checked={editingRTSContext.editingRTS.newItem.is_available}
              onChange={(e) => {
                editingRTSContext.setEditingRTS({
                  ...editingRTSContext.editingRTS,
                  newItem: {
                    ...editingRTSContext.editingRTS.newItem,
                    is_available: e.target.checked,
                  },
                });
              }}
            />
          </Col>
        </Row>
        <br />
        <hr style={{ borderColor: 'white' }} />
        <br />
        <Row>
          <Col md={12}>
            <h1 style={{ fontSize: '24px', font: 'SF-Compact-Text-Semibold' }}>
              Notification
            </h1>
            <Row style={{ fontSize: '18px' }}>
              <Col md={4}>
                <div>
                  <input
                    style={{
                      width: '30%',
                      borderRadius: '8px',
                      border: 'none',
                      marginRight: '20px',
                      marginBottom: '10px',
                      padding: '3px',
                      outline: 'none',
                    }}
                    type="number"
                    value={
                      editingRTSContext.editingRTS.newItem.ta_notifications
                        .before.time
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications,
                            before: {
                              ...editingRTSContext.editingRTS.newItem
                                .ta_notifications.before,
                              time: e.target.value,
                            },
                          },
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications,
                            before: {
                              ...editingRTSContext.editingRTS.newItem
                                .user_notifications.before,
                              time: e.target.value,
                            },
                          },
                        },
                      });
                    }}
                  />
                  Mins Before Start Time
                </div>
                <div>
                  User
                  <input
                    style={{
                      padding: '3px',
                      outline: 'none',
                      margin: ' 0 5px',
                      width: '1.3em',
                      height: '1.3em',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      verticalAlign: 'middle',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    type="checkbox"
                    checked={
                      editingRTSContext.editingRTS.newItem.user_notifications
                        .before.is_enabled
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications,
                            before: {
                              ...editingRTSContext.editingRTS.newItem
                                .user_notifications.before,
                              is_enabled: e.target.checked,
                              is_set: e.target.checked,
                            },
                          },
                        },
                      });
                    }}
                  />
                  <input
                    style={{
                      borderRadius: '8px',
                      border: 'none',
                      padding: '3px 10px',
                      outline: 'none',
                      margin: '5px 0',
                    }}
                    placeholder="Enter message"
                    value={
                      editingRTSContext.editingRTS.newItem.user_notifications
                        .before.message
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications,
                            before: {
                              ...editingRTSContext.editingRTS.newItem
                                .user_notifications.before,
                              message: e.target.value,
                            },
                          },
                        },
                      });
                    }}
                  />
                </div>
                <div>
                  TA
                  <input
                    style={{
                      padding: '3px',
                      outline: 'none',
                      margin: ' 0 5px',
                      width: '1.3em',
                      height: '1.3em',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      verticalAlign: 'middle',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    type="checkbox"
                    checked={
                      editingRTSContext.editingRTS.newItem.ta_notifications
                        .before.is_enabled
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications,
                            before: {
                              ...editingRTSContext.editingRTS.newItem
                                .ta_notifications.before,
                              is_enabled: e.target.checked,
                              is_set: e.target.checked,
                            },
                          },
                        },
                      });
                    }}
                  />
                  <input
                    style={{
                      borderRadius: '8px',
                      border: 'none',
                      padding: '3px 10px',
                      outline: 'none',
                      margin: '5px 0',
                    }}
                    placeholder="Enter message"
                    value={
                      editingRTSContext.editingRTS.newItem.ta_notifications
                        .before.message
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications,
                            before: {
                              ...editingRTSContext.editingRTS.newItem
                                .ta_notifications.before,
                              message: e.target.value,
                            },
                          },
                        },
                      });
                    }}
                  />
                </div>
              </Col>
              <Col md={4}>
                <div>
                  <input
                    type="number"
                    style={{
                      width: '30%',
                      borderRadius: '8px',
                      border: 'none',
                      marginRight: '20px',
                      marginBottom: '10px',
                      padding: '3px',
                      outline: 'none',
                    }}
                    value={
                      editingRTSContext.editingRTS.newItem.ta_notifications
                        .during.time
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications,
                            during: {
                              ...editingRTSContext.editingRTS.newItem
                                .ta_notifications.during,
                              time: e.target.value,
                            },
                          },
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications,
                            during: {
                              ...editingRTSContext.editingRTS.newItem
                                .user_notifications.during,
                              time: e.target.value,
                            },
                          },
                        },
                      });
                    }}
                  />
                  Mins After Start Time
                </div>
                <div>
                  User
                  <input
                    style={{
                      padding: '3px',
                      outline: 'none',
                      margin: ' 0 5px',
                      width: '1.3em',
                      height: '1.3em',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      verticalAlign: 'middle',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    type="checkbox"
                    checked={
                      editingRTSContext.editingRTS.newItem.user_notifications
                        .during.is_enabled
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications,
                            during: {
                              ...editingRTSContext.editingRTS.newItem
                                .user_notifications.during,
                              is_enabled: e.target.checked,
                              is_set: e.target.checked,
                            },
                          },
                        },
                      });
                    }}
                  />
                  <input
                    style={{
                      borderRadius: '8px',
                      border: 'none',
                      padding: '3px 10px',
                      outline: 'none',
                      margin: '5px 0',
                    }}
                    placeholder="Enter message"
                    value={
                      editingRTSContext.editingRTS.newItem.user_notifications
                        .during.message
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications,
                            during: {
                              ...editingRTSContext.editingRTS.newItem
                                .user_notifications.during,
                              message: e.target.value,
                            },
                          },
                        },
                      });
                    }}
                  />
                </div>
                <div>
                  TA
                  <input
                    style={{
                      padding: '3px',
                      outline: 'none',
                      margin: ' 0 5px',
                      width: '1.3em',
                      height: '1.3em',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      verticalAlign: 'middle',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    type="checkbox"
                    checked={
                      editingRTSContext.editingRTS.newItem.ta_notifications
                        .during.is_enabled
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications,
                            during: {
                              ...editingRTSContext.editingRTS.newItem
                                .ta_notifications.during,
                              is_enabled: e.target.checked,
                              is_set: e.target.checked,
                            },
                          },
                        },
                      });
                    }}
                  />
                  <input
                    style={{
                      borderRadius: '8px',
                      border: 'none',
                      padding: '3px 10px',
                      outline: 'none',
                      margin: '5px 0',
                    }}
                    placeholder="Enter message"
                    value={
                      editingRTSContext.editingRTS.newItem.ta_notifications
                        .during.message
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications,
                            during: {
                              ...editingRTSContext.editingRTS.newItem
                                .ta_notifications.during,
                              message: e.target.value,
                            },
                          },
                        },
                      });
                    }}
                  />
                </div>
              </Col>
              <Col md={4}>
                <div>
                  <input
                    type="number"
                    style={{
                      width: '30%',
                      borderRadius: '8px',
                      border: 'none',
                      marginRight: '20px',
                      marginBottom: '10px',
                      padding: '3px',
                      outline: 'none',
                    }}
                    value={
                      editingRTSContext.editingRTS.newItem.ta_notifications
                        .after.time
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications,
                            after: {
                              ...editingRTSContext.editingRTS.newItem
                                .ta_notifications.after,
                              time: e.target.value,
                            },
                          },
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications,
                            after: {
                              ...editingRTSContext.editingRTS.newItem
                                .user_notifications.after,
                              time: e.target.value,
                            },
                          },
                        },
                      });
                    }}
                  />
                  Mins After End Time
                </div>
                <div>
                  User
                  <input
                    style={{
                      padding: '3px',
                      outline: 'none',
                      margin: ' 0 5px',
                      width: '1.3em',
                      height: '1.3em',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      verticalAlign: 'middle',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    type="checkbox"
                    checked={
                      editingRTSContext.editingRTS.newItem.user_notifications
                        .after.is_enabled
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications,
                            after: {
                              ...editingRTSContext.editingRTS.newItem
                                .user_notifications.after,
                              is_enabled: e.target.checked,
                              is_set: e.target.checked,
                            },
                          },
                        },
                      });
                    }}
                  />
                  <input
                    style={{
                      borderRadius: '8px',
                      border: 'none',
                      padding: '3px 10px',
                      outline: 'none',
                      margin: '5px 0',
                    }}
                    placeholder="Enter message"
                    value={
                      editingRTSContext.editingRTS.newItem.user_notifications
                        .after.message
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          user_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .user_notifications,
                            after: {
                              ...editingRTSContext.editingRTS.newItem
                                .user_notifications.after,
                              message: e.target.value,
                            },
                          },
                        },
                      });
                    }}
                  />
                </div>
                <div>
                  TA
                  <input
                    style={{
                      padding: '3px',
                      outline: 'none',
                      margin: ' 0 5px',
                      width: '1.3em',
                      height: '1.3em',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      verticalAlign: 'middle',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    type="checkbox"
                    checked={
                      editingRTSContext.editingRTS.newItem.ta_notifications
                        .after.is_enabled
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications,
                            after: {
                              ...editingRTSContext.editingRTS.newItem
                                .ta_notifications.after,
                              is_enabled: e.target.checked,
                              is_set: e.target.checked,
                            },
                          },
                        },
                      });
                    }}
                  />
                  <input
                    style={{
                      borderRadius: '8px',
                      border: 'none',
                      padding: '3px 10px',
                      outline: 'none',
                      margin: '5px 0',
                    }}
                    placeholder="Enter message"
                    value={
                      editingRTSContext.editingRTS.newItem.ta_notifications
                        .after.message
                    }
                    onChange={(e) => {
                      editingRTSContext.setEditingRTS({
                        ...editingRTSContext.editingRTS,
                        newItem: {
                          ...editingRTSContext.editingRTS.newItem,
                          ta_notifications: {
                            ...editingRTSContext.editingRTS.newItem
                              .ta_notifications,
                            after: {
                              ...editingRTSContext.editingRTS.newItem
                                .ta_notifications.after,
                              message: e.target.value,
                            },
                          },
                        },
                      });
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div
              style={{
                textAlign: 'center',
              }}
            >
              <button
                style={{
                  width: '100px',
                  padding: '10px',
                  margin: '0 20px',
                  backgroundColor: 'inherit',
                  border: '2px white solid',
                  color: '#ffffff',
                  textAlign: 'center',
                  borderRadius: '20px',
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  width: '100px',
                  padding: '10px',
                  margin: '0 20px',
                  backgroundColor: 'inherit',
                  border: '2px white solid',
                  color: '#ffffff',
                  textAlign: 'center',
                  borderRadius: '20px',
                }}
                onClick={updateRTS}
              >
                Save
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditRTS;
