import React, { useContext, useEffect, useState } from 'react';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import axios from 'axios';
import moment from 'moment';
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
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import EditIcon from './EditRTS/EditIcon.jsx';
import {
  faCalendarDay,
} from '@fortawesome/free-solid-svg-icons';
import EditActionIcon from './EditATS/EditIcon.jsx';
import EditStepsIcon from './EditIS/EditIcon.jsx';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { Footer } from 'rsuite';
const BASE_URL = process.env.REACT_APP_BASE_URL;

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

export default function Firebasev2(props) {
  console.log('curdate today firebase props ', props);
  const history = useHistory();
  const inRange = [];
  const currentUser = props.theCurrentUserID;
  //var currentUser = ''

  // if (
  //     document.cookie
  //       .split(";")
  //       .some(item => item.trim().startsWith("patient_uid="))
  //   ) {
  //     currentUser = document.cookie.split('; ').find(row => row.startsWith('patient_uid=')).split('=')[1]
  //   } else {
  //     currentUser = props.theCurrentUserID;
  //   }

  const [listOfBlocks, setlistOfBlocks] = useState([]);
  const [historyGot, setHG] = useState([]);
  const [toggleActions, setToggleActions] = useState(false);
  const [getActions, setActions] = useState([]);
  const [getSteps, setSteps] = useState('');

  const [iconColor, setIconColor] = useState();
  //NOTE This gives you routines within 7 days of current date. Change currentDate to change that
  const [currentDate, setCurDate] = useState(new Date(Date.now()));
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [allTAData, setTAData] = useState([]);
  const [allPatientData, setPatientData] = useState([]);

  // var copiedRoutineName = ''
  
  useEffect(() => {
    // props.setEvents([]);
    // props.setGetActionsEndPoint({});
    // props.setGetStepsEndPoint({});
    props.setEvents({});
  }, [props.theCurrentUserID]);

  useEffect(() => {
    makeActionDisplays();
    // console.log('here-2: gsep on useEffect = ', props.getStepsEndPoint);
  }, [
    props.events,
    props.theCurrentUserID,
  ]);

  const getTimes = (a_day_time, b_day_time) => {
    const [a_start_time, b_start_time] = [
      a_day_time.substring(10, a_day_time.length),
      b_day_time.substring(10, b_day_time.length),
    ];
    const [a_HMS, b_HMS] = [
      a_start_time
        .substring(0, a_start_time.length - 3)
        .replace(/\s{1,}/, '')
        .split(':'),
      b_start_time
        .substring(0, b_start_time.length - 3)
        .replace(/\s{1,}/, '')
        .split(':'),
    ];
    const [a_parity, b_parity] = [
      a_start_time
        .substring(a_start_time.length - 3, a_start_time.length)
        .replace(/\s{1,}/, ''),
      b_start_time
        .substring(b_start_time.length - 3, b_start_time.length)
        .replace(/\s{1,}/, ''),
    ];

    let [a_time, b_time] = [0, 0];
    if (a_parity === 'PM' && a_HMS[0] !== '12') {
      const hoursInt = parseInt(a_HMS[0]) + 12;
      a_HMS[0] = `${hoursInt}`;
    } else if (a_parity === 'AM' && a_HMS[0] === '12') a_HMS[0] = '00';

    if (b_parity === 'PM' && b_HMS[0] !== '12') {
      const hoursInt = parseInt(b_HMS[0]) + 12;
      b_HMS[0] = `${hoursInt}`;
    } else if (b_parity === 'AM' && b_HMS[0] === '12') b_HMS[0] = '00';

    for (let i = 0; i < a_HMS.length; i++) {
      a_time += Math.pow(60, a_HMS.length - i - 1) * parseInt(a_HMS[i]);
      b_time += Math.pow(60, b_HMS.length - i - 1) * parseInt(b_HMS[i]);
    }

    return [a_time, b_time];
  };

  useEffect(() => console.log('gsep = ', props.events), [props.events]);

  useEffect(() => {
    setHG([]);
    setTAData([]);
    setPatientData([]);

    axios
      .get(BASE_URL + 'listAllTAForCopy')
      .then((response) => {
        console.log('res.data.res = ', response.data.result);
        setTAData(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(BASE_URL + 'listAllUsersForCopy')
      .then((response) => {
        setPatientData(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.currentUser]);

  //makes listOfBlocks with list of displays routines and such
  function makeActionDisplays() {
    let url = BASE_URL + 'calenderEvents/';
    let start = props.stateValue.dateContext.format('YYYY-MM-DD') + 'T00:00:00-07:00';
    let endofWeek = moment(props.stateValue.dateContext).add(6, 'days');
    let end = endofWeek.format('YYYY-MM-DD') + 'T23:59:59-07:00';
    let id = props.theCurrentUserID;

    axios
      .post(url + id.toString() + ',' + start.toString() + ',' + end.toString())
      .then((response) => {
        console.log('day events ', response.data);
        const temp = [];

        for (let i = 0; i < response.data.length; i++) {
          temp.push(response.data[i]);
        }
        temp.sort((a, b) => {
          // console.log('a = ', a, '\nb = ', b);
          const [a_start, b_start] = [
            a['start']['dateTime'],
            b['start']['dateTime'],
          ];
          console.log('a_start = ', a_start, '\nb_start = ', b_start);
          const [a_end, b_end] = [a['end']['dateTime'], b['end']['dateTime']];

          const [a_start_time, b_start_time] = getTimes(
            a['start']['dateTime'],
            b['start']['dateTime']
          );
          const [a_end_time, b_end_time] = getTimes(
            a['end']['dateTime'],
            b['end']['dateTime']
          );

          if (a_start_time < b_start_time) return -1;
          else if (a_start_time > b_start_time) return 1;
          else {
            if (a_end_time < b_end_time) return -1;
            else if (a_end_time > b_end_time) return 1;
            else {
              if (a_start < b_start) return -1;
              else if (a_start > b_start) return 1;
              else {
                if (a_end < b_end) return -1;
                else if (a_end > b_end) return 1;
              }
            }
          }

          return 0;
        });

        console.log('homeTemp = ', temp);

        setActions(temp);
      })
      .catch((error) => {
        console.log('here: Error in getting goals and routines ' + error);
      });
 
    var tempRows = [];
    var tempID = [];
    var tempIsID = [];
    console.log('only 0.1.0',getActions);
    const uniqueObjects = [
      ...new Map(
        getActions.map((item) => [item.id, item])
      ).values(),
    ];
    console.log('unique obj', uniqueObjects, getActions);
    for (var i = 0; i < uniqueObjects.length; i++) {
      tempRows.push(displayRoutines(getActions[i]));
      console.log('p.ggep[i] = ', getActions[i].id);
      
    }
    console.log('tempRows', tempRows, tempID);
    setlistOfBlocks(tempRows);
  }
  function formatDateTime(str) {
    let newTime = new Date(str).toLocaleTimeString();
    return newTime.replace(/:\d+ /, ' ');
  }

  //no need to use GR here - "is_avalible" is part of "r" and comes from getHistory
  //this was causing an error of not showing routines on the left side of home when
  //switching pages, because GR was not getting updated before this was. So GR
  //was empty. now no need for GR and no issue.
  function getIsAvailableFromGR(r) {
    // console.log('checking availability', r, GR, currentUser)
    // var NTC1 = r.name
    // for (var i=0; i < GR.length; i++) {
    //     var NTC2 = GR[i].summary
    //     console.log('match ntcs',NTC1, NTC2, i, GR.length)
    //     if(NTC1 == NTC2) {
    //         console.log('match', GR[i].summary, r.name)
    // if (GR[i].is_available == 'True') {
    var temp = [];
    var temp2 = [];

    for (var i = 0; i < props.events.length; i++) {
      temp.push(props.events[i].summary);
    }

    for (var j = 0; j < props.events.length; j++) {
      temp2.push(props.events[j].id);
    }
    console.log('titles', temp);
    console.log('titles2', temp2);

    console.log('current name', r.name, temp.indexOf(r.name));
    console.log('current id', r.id, temp2.indexOf(r.id));

    if (temp2.indexOf(r.id) == -1) {
      return 'E';
    }

    if (r.is_available == 'True') {
      // console.log('match true',GR[i].is_available)
      return (
        <div>
          <FontAwesomeIcon
            title="Available to the user"
            style={{ color: '#ffffff', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              alert('Item Is Availble to the user');
            }}
            icon={faUser}
            size="sm"
          />
        </div>
      );
    } else {
      // console.log('match false',GR[i].is_available)
      return (
        <div>
          <FontAwesomeIcon
            title="Unavailable to the user"
            style={{ color: '#000000', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              alert('Item Is NOT Availble to the user' + r.is_available);
            }}
            icon={faUserAltSlash}
            size="sm"
          />
        </div>
      );
    }
    //     } else {

    //         var temp = []
    //         for (var j = 0; j < GR.length; j++) {
    //             temp.push(GR[j].summary)
    //         }
    //         console.log('no match found', r.name, temp)
    //     }
    // }
    return 'E';
  }

  //Creates actual boxes to display

  function displayRoutines(r) {
    const ret = getIsAvailableFromGR(r);
    const start_time = r.start.dateTime.substring(11).split(/[:\s+]/);
    // Need to strip trailing zeros because the data in the database
    // is inconsistent about this
    if (start_time[0][0] == '0') start_time[0] = start_time[0][1];
    const end_time = r.end.dateTime.substring(11).split(/[:\s+]/);
    // Need to strip trailing zeros because the data in the database
    // is inconsistent about this
    if (end_time[0][0] == '0') end_time[0] = end_time[0][1];
    //console.log('displayActions', start_time, end_time);
    return (
      <ListGroup.Item
        key={r.id}
        style={{ backgroundColor: '#BBC7D7', marginTop: '1px' }}
        onClick={() => {
          //  props.sethighLight(r["summary"])
          console.log('ListGroup', r['summary']);
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            flex="1"
            style={{
              marginLeft: '1rem',
              height: '4.5rem',
              borderRadius: '10px',
              width: '65%',
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: (() => {
                if (
                  r.is_persistent == 'True' &&
                  JSON.stringify(start_time) !== JSON.stringify(end_time)
                ) {
                  return '#FF6B4A';
                } else if (r.is_persistent == 'False') {
                  return '#376DAC';
                } else {
                  return '#9b4aff';
                }
              })(),
              // backgroundColor:
              //       JSON.stringify(start_time) !== JSON.stringify(end_time)
              //     ? '#FF6B4A'
              //     : '#9b4aff',
              boxShadow:
                '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.09)',
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
                {r.start.dateTime && r.end.dateTime ? (
                  <div
                    style={{
                      fontSize: '8px',
                      color: '#ffffff',
                    }}
                  >
                    {formatDateTime(r.start.dateTime)}-
                    {formatDateTime(r.end.dateTime)}
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
                {r['summary']}
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
                  {/* <img
                    src={r.gr_photo}
                    alt="Events"
                    className="center"
                    height="28px"
                    width="28px"
                  /> */}
                  <FontAwesomeIcon
                    style={{ cursor: 'pointer', color:'white' }}
                    icon={faCalendarDay}
                    size="2x"
                  />
                </Col>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex' }}>
            <div
              style={{
                marginRight: '1rem',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
              }}
            >
              <div style={{ flex: '1' }}>
                <div></div>
              </div>

              {/* </div> */}
            </div>
            <div
              style={{
                marginRight: '1rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div>
                <EditIcon
                  routine={r}
                  task={null}
                  step={currentUser}
                  events={props.events}
                  //  id={currentUser}
                />
              </div>
              {/* working on this thing */}

              <div>
                <PlaylistAddIcon
                  onMouseOver={(event) => {
                    event.target.style.color = '#48D6D2';
                  }}
                  onMouseOut={(event) => {
                    event.target.style.color = '#FFFFFF';
                  }}
                  style={{ color: '#ffffff', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.target.style.color = '#000000';
                    props.setATS(props.newATS);
                    props.setrID(r);
                  }}
                />
              </div>
              <div style={{ flex: '1' }}>
                <FontAwesomeIcon
                  title="Delete Item 1"
                  onMouseOver={(event) => {
                    event.target.style.color = '#48D6D2';
                  }}
                  onMouseOut={(event) => {
                    event.target.style.color = '#FFFFFF';
                  }}
                  style={{ color: '#FFFFFF', cursor: 'pointer' }}
                  // style ={{ color:  "#000000" }}
                  // onClick={(e) => {                }}
                  icon={faTrashAlt}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      </ListGroup.Item>
    );
    //    }
  }

  return (
    <row>
      {/* {makeDisplays()} */}
      {/* {getCurrentUser()} */}
      {listOfBlocks}
    </row>
  );
}
