import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  faUser,
  faUserAltSlash,
  faTrophy,
  faRunning,
  faBookmark,
  faEdit,
  faList,
  faCopy,
  faAlignCenter,
} from '@fortawesome/free-solid-svg-icons';
import { useHistory, Redirect } from 'react-router-dom';
import {
  ListGroup,
  Row,
  Col,
  Modal,
  InputGroup,
  FormControl,
  Table,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import MiniNavigation from '../manifest/miniNavigation';
import './history.css';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  buttonSelection: {
    width: '20%',
    height: '70px',
    borderBottomLeftRadius: '25%',
    borderBottomRightRadius: '25%',
    color: '#FFFFFF',
    backgroundColor: '#bbc8d7',
    textTransform: 'capitalize',
  },
  buttonContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    textTransform: 'lowercase',
  },

  dateContainer: {
    height: '70px',
    width: 'relative',
    color: '#FFFFFF',
    // flex: 1,
    // display: 'flex',
  },
});

const VerticalRoutine = ({
  onlyAllowed,
  userID,
  sendRoutineToParent,
  allRows,
}) => {
  const history = useHistory();
  const currentUser = userID;
  console.log('VR CURRENT USER: ' + currentUser);
  const [routinesGot, setRoutines] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [onlyAllowedHere, setOAH] = useState([]);
  const classes = useStyles();
  console.log('allRows', allRows);
  console.log('onlyAllowed', onlyAllowed);

  if (onlyAllowed != onlyAllowedHere) {
    //see if we got new data to display
    console.log('new onlyAllowed in');
    setOAH(onlyAllowed);
    makeDisplays(onlyAllowed);
  }

  function makeDisplays(onlyAllowed) {
    //add displays to tempRows
    var tempRows = [];
    for (var i = 0; i < onlyAllowed.length; i++) {
      if (onlyAllowed[i].type == 'Routine') {
        tempRows.push(displayRoutines(onlyAllowed[i]));
      } else if (onlyAllowed[i].type == 'Action') {
        tempRows.push(displayActions(onlyAllowed[i]));
      } else {
        tempRows.push(displayInstructions(onlyAllowed[i]));
      }
    }
    console.log('tempRows = ', tempRows);
    console.log('onlyAllowed = ', onlyAllowed);
    setRows(tempRows);
  }

  function formatDateTime(str) {
    let newTime = new Date(str.replace(/-/g, '/')).toLocaleTimeString();
    return newTime.replace(/:\d+ /, ' ');
  }

  function displayRoutines(r) {
    return (
      <div
        style={{
          height: '6rem',
          width: '100%',
          backgroundColor: '#BBC7D7',
          marginBottom: '0px',
          marginTop: '2px',
        }}
      > 
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            flex="1"
            style={{
              marginLeft: '1rem',
              marginTop: '1rem',
              height: '4.5rem',
              borderRadius: '10px',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: '#FF6B4A',
              boxShadow:
                '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',
              zIndex: '50%',
            }}
            onClick={() => {
              if (r.is_sublist_available === 'True') {
                sendRoutineToParent(r.number);
                setLoading(!isLoading);
              }
            }}
          >
            <div
              flex="1"
              style={{
                marginTop: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <div style={{ marginLeft: '1rem' }}>
                {r['startTime'] && r['endTime'] ? (
                  <div
                    style={{
                      fontSize: '8px',
                      color: '#ffffff',
                    }}
                  >
                    {console.log('r in vr2 = ', r)}
                    {formatDateTime(r['startTime'])}-
                    {formatDateTime(r['endTime'])}
                  </div>
                ) : (
                  <Col> </Col>
                )}
              </div>

              <div
                style={{
                  color: '#ffffff',
                  size: '24px',
                  textDecoration: 'underline',
                  fontWeight: 'bold',
                  marginLeft: '10px',
                }}
              >
                {r['name']}
              </div>

              {/* ({date}) */}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
              }}
            >
              <div>
                <Col
                  xs={7}
                  style={{ paddingRight: '1rem', marginTop: '0.5rem' }}
                >
                  <img
                    src={r['photo']}
                    alt="Routines"
                    className="center"
                    height="28px"
                    width="28px"
                  />
                </Col>
              </div>
              <div style={{ marginLeft: '1.5rem' }}>
                {r.is_sublist_available === 'True' ? (
                  <div>
                    <FontAwesomeIcon
                      icon={faList}
                      title="SubList Available"
                      style={{ color: '#ffffff' }}
                      size="small"
                      onClick={() => {
                        console.log('logpog1');
                        sendRoutineToParent(r.number);
                        setLoading(!isLoading);
                      }}
                    />
                  </div>
                ) : (
                  <div
                  // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                  ></div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: '1rem' }}>
            {/* STUFF GOES HERE */}
            <div
              style={{
                width: '55px',
                height: '4.5rem',
                borderRadius: '10px',
                border: '2px solid #51CC4E',
                background: '#FFFFFF',
                marginLeft: '10px',
                marginRight: '10px',
                flex: '1',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Col>
                <Row
                  title="Percentage of routine completed in last 7 days"
                  style={{
                    justifyContent: 'center',
                    color: '#FF6B4A',
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >
                  {getPercent(r)}
                </Row>
                <Row
                  title="Percentage of actions completed in last 7 days"
                  style={{
                    justifyContent: 'center',
                    color: '#F8BE28',
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >
                  {getBelowPercent(r)}
                </Row>
                <Row
                  title="Percentage of instructions completed in last 7 days"
                  style={{
                    justifyContent: 'center',
                    color: '#67ABFC',
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >
                  {getDoubleBelowPercent(r)}
                </Row>
              </Col>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function displayActions(a) {
    return (
      <div
        style={{
          height: '98px',
          width: '100%',
          backgroundColor: '#d1dceb',
          marginBottom: '0px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            flex="1"
            style={{
              marginLeft: '1.5rem',
              marginTop: '1rem',
              height: '4.25rem',
              borderRadius: '10px',
              width: '83%',
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: '#F8BE28',
              boxShadow:
                '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',
              zIndex: '50%',
            }}
            onClick={() => {
              if (a.is_sublist_available === 'True') {
                console.log('here ac');
                sendRoutineToParent(a.number);
                setLoading(!isLoading);
              }
            }}
          >
            <div
              flex="1"
              style={{
                marginTop: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <div style={{ marginLeft: '1rem' }}>
                {true ? (
                  <div
                    style={{
                      fontSize: '8px',
                      color: '#F8BE28',
                    }}
                  >
                    {formatDateTime('6/23/2021, 7:31:19 AM')}-
                    {formatDateTime('6/23/2021, 8:31:56 AM')}
                  </div>
                ) : (
                  <Col> </Col>
                )}
              </div>

              <div
                style={{
                  color: '#ffffff',
                  size: '24px',
                  textDecoration: 'underline',
                  fontWeight: 'bold',
                  marginLeft: '10px',
                }}
              >
                {a['name']}
              </div>

              {/* ({date}) */}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
              }}
            >
              <div>
                <Col
                  xs={7}
                  style={{ paddingRight: '1rem', marginTop: '0.5rem' }}
                >
                  <img
                    src={a['photo']}
                    alt="Routines"
                    className="center"
                    height="28px"
                    width="28px"
                  />
                </Col>
              </div>
              <div style={{ marginLeft: '1.5rem' }}>
                {a.is_sublist_available === 'True' ? (
                  <div>
                    <FontAwesomeIcon
                      icon={faList}
                      title="SubList Available"
                      style={{ color: '#ffffff' }}
                      size="small"
                      onClick={() => {
                        // sendRoutineToParent(a.number);
                        // setLoading(!isLoading);
                      }}
                    />
                  </div>
                ) : (
                  <div
                  // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
                  ></div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: '1rem' }}>
            {/* STUFF GOES HERE */}
            <div
              style={{
                width: '55px',
                height: '4.5rem',
                borderRadius: '10px',
                border: '2px solid #51CC4E',
                background: '#FFFFFF',
                marginLeft: '10px',
                marginRight: '10px',
                flex: '1',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Col>
                <Row
                  title="Percentage of action completed in last 7 days"
                  style={{
                    marginTop: '12px',
                    justifyContent: 'center',
                    color: '#F8BE28',
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >
                  {getPercent(a)}
                </Row>
                <Row
                  title="Percentage of instructions completed in last 7 days"
                  style={{
                    justifyContent: 'center',
                    color: '#67ABFC',
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >
                  {getBelowPercent(a)}
                </Row>
              </Col>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function displayInstructions(i) {
    console.log('i: ', i);
    return (
      <div
        style={{
          height: '98px',
          width: '100%',
          backgroundColor: '#dae5f5',
          marginBottom: '0px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            flex="1"
            style={{
              marginLeft: '2rem',
              marginTop: '1rem',
              height: '4rem',
              borderRadius: '10px',
              width: '80%',
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: '#67ABFC',
              boxShadow:
                '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',
              zIndex: '50%',
            }}
          >
            <div
              flex="1"
              style={{
                marginTop: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <div style={{ marginLeft: '1rem' }}>
                {true ? (
                  <div
                    style={{
                      fontSize: '8px',
                      color: '#67ABFC',
                    }}
                  >
                    {formatDateTime('6/23/2021, 8:31:56 AM')}-
                    {formatDateTime('6/23/2021, 8:31:56 AM')}
                  </div>
                ) : (
                  <Col> </Col>
                )}
              </div>

              <div
                style={{
                  color: '#ffffff',
                  size: '24px',
                  textDecoration: 'underline',
                  fontWeight: 'bold',
                  marginLeft: '10px',
                }}
              >
                {i['name']}
              </div>

              {/* ({date}) */}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
              }}
            >
              <div>
                <Col
                  xs={7}
                  style={{ paddingRight: '1rem', marginTop: '0.5rem' }}
                >
                  <img
                    src={i['photo']}
                    alt="Routines"
                    className="center"
                    height="28px"
                    width="28px"
                  />
                </Col>
              </div>
              <div style={{ marginLeft: '1.5rem' }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: '1rem' }}>
            {/* STUFF GOES HERE */}
            <div
              style={{
                width: '55px',
                height: '4.5rem',
                borderRadius: '10px',
                border: '2px solid #51CC4E',
                background: '#FFFFFF',
                marginLeft: '10px',
                marginRight: '10px',
                flex: '1',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Col>
                <Row
                  title="Percentage of instructions completed in last 7 days"
                  style={{
                    marginTop: '24px',
                    justifyContent: 'center',
                    color: '#67ABFC',
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >
                  {getPercent(i)}
                </Row>
              </Col>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function getPercent(x) {
    var total = getTotalAndDone(x)[0];
    var done = getTotalAndDone(x)[1];
    const pct = Math.round((done / total) * 100) + '%';
    return pct === 'NaN%' ? '-%' : pct;
  }

  function getBelowPercent(x) {
    var total = 0;
    var done = 0;
    // console.log("rows in get below", )
    for (const item of allRows) {
      if (item.under === x.number) {
        total = total + getTotalAndDone(item)[0];
        done = done + getTotalAndDone(item)[1];
      }
    }
    if (total === 0) {
      return '';
    }
    const pct = Math.round((done / total) * 100) + '%';
    return pct === 'NaN%' ? '-%' : pct;
  }

  function getDoubleBelowPercent(x) {
    var total = 0;
    var done = 0;
    for (const item of allRows) {
      if (item.under === x.number) {
        for (const item2 of allRows) {
          if (item2.under === item.number) {
            total = total + getTotalAndDone(item2)[0];
            done = done + getTotalAndDone(item2)[1];
          }
        }
      }
    }
    if (total === 0) {
      return '';
    }
    console.log('total', total, 'done', done);
    const pct = Math.round((done / total) * 100) + '%';
    return pct === 'NaN%' ? '-%' : pct;
  }

  function getTotalAndDone(x) {
    var total = 0;
    var done = 0;
    if (x.mon != undefined) {
      total++;
      if (
        x.mon.props.className === 'cR' ||
        x.mon.props.className === 'cA' ||
        x.mon.props.className === 'cI'
      ) {
        done++;
      }
    }
    if (x.tue != undefined) {
      total++;
      if (
        x.tue.props.className === 'cR' ||
        x.tue.props.className === 'cA' ||
        x.tue.props.className === 'cI'
      ) {
        done++;
      }
    }
    if (x.wed != undefined) {
      total++;
      if (
        x.wed.props.className === 'cR' ||
        x.wed.props.className === 'cA' ||
        x.wed.props.className === 'cI'
      ) {
        done++;
      }
    }
    if (x.thurs != undefined) {
      total++;
      if (
        x.thurs.props.className === 'cR' ||
        x.thurs.props.className === 'cA' ||
        x.thurs.props.className === 'cI'
      ) {
        done++;
      }
    }
    if (x.fri != undefined) {
      total++;
      if (
        x.fri.props.className === 'cR' ||
        x.fri.props.className === 'cA' ||
        x.fri.props.className === 'cI'
      ) {
        done++;
      }
    }
    if (x.sat != undefined) {
      total++;
      if (
        x.sat.props.className === 'cR' ||
        x.sat.props.className === 'cA' ||
        x.sat.props.className === 'cI'
      ) {
        done++;
      }
    }
    if (x.sun != undefined) {
      total++;
      if (
        x.sun.props.className === 'cR' ||
        x.sun.props.className === 'cA' ||
        x.sun.props.className === 'cI'
      ) {
        done++;
      }
    }
    console.log([total, done]);
    return [total, done];
  }

  return (
    <Box width="350px">
      <MiniNavigation />
      <div style={{ height: '54.5px', margin: '0px' }}>
        <Row>
          <Col>
            <Row
              style={{
                margin: '0px',
                fontSize: 12,
                fontWeight: 'bold',
                padding: '4px',
              }}
            >
              <div
                className="cR"
                style={{
                  width: '22px',
                  height: '22px',
                  border: '#000000',
                  backgroundColor: '#000000',
                }}
              ></div>
              <p
                style={{ margin: '0px', paddingLeft: '6px', fontSize: '14px' }}
              >
                {'Completed'}
              </p>
            </Row>
            <Row
              style={{
                margin: '0px',
                fontSize: 12,
                fontWeight: 'bold',
                padding: '4px',
              }}
              align="right"
            >
              <div
                className="ipR"
                style={{
                  width: '22px',
                  height: '22px',
                  paddingBottom: '0px',
                  margin: '0px',
                  borderColor: '#000000',
                  borderWidth: '2px',
                  backgroundColor: '#000000',
                }}
              >
                <div
                  className="whiteHalfSide"
                  style={{
                    borderBottomRightRadius: '9px',
                    borderTopRightRadius: '9px',
                    marginTop: '0px',
                    paddingTop: '0px',
                  }}
                ></div>
              </div>
              <p
                style={{ margin: '0px', paddingLeft: '6px', fontSize: '14px' }}
              >
                {'Partially Done'}
              </p>
            </Row>
          </Col>
          <Col>
            <Row
              style={{
                margin: '0px',
                fontSize: 12,
                fontWeight: 'bold',
                padding: '4px',
              }}
              align="right"
            >
              <div
                className="ipR"
                style={{
                  width: '22px',
                  height: '22px',
                  paddingBottom: '0px',
                  margin: '0px',
                  borderColor: '#000000',
                  borderWidth: '2px',
                  backgroundColor: '#000000',
                }}
              >
                <div
                  className="whiteHalfTop"
                  style={{
                    borderTopRightRadius: '11px',
                    borderTopLeftRadius: '11px',
                    marginTop: '0px',
                    paddingTop: '0px',
                  }}
                ></div>
              </div>
              <p
                style={{ margin: '0px', paddingLeft: '6px', fontSize: '14px' }}
              >
                {'Autofilled'}
              </p>
            </Row>
            <Row
              style={{
                margin: '0px',
                fontSize: 12,
                fontWeight: 'bold',
                padding: '4px',
              }}
            >
              <div
                className="nsR"
                style={{
                  width: '22px',
                  height: '22px',
                  border: '2px solid #000000',
                  backgroundColor: '#FFFFFF',
                }}
              ></div>
              <p
                style={{ margin: '0px', paddingLeft: '6px', fontSize: '14px' }}
              >
                {'Not Started'}
              </p>
            </Row>
          </Col>
        </Row>
      </div>
      <row>{rows}</row>
    </Box>
  );
};

export default VerticalRoutine;
