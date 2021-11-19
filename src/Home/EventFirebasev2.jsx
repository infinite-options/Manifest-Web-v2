import React, {  useEffect, useState, useModal } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  faPeopleArrows,
  faUser,
  faUserAltSlash,
} from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import {
  ListGroup,
  Col,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faList } from '@fortawesome/free-solid-svg-icons';
import {
  faCalendarDay,
} from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/core/styles';
import { updateTheCalenderEvent, deleteTheCalenderEvent } from './GoogleApiService';
import DeleteEventModal from './DeleteEventModal';
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

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

export default function EventFirebasev2(props) {
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
  const [rec,setRec] = useState(false);
  const [recList, setRecList] = useState([])
  const [historyGot, setHG] = useState([]);
  const [getActions, setActions] = useState([]);
  const [getRecEvents, setRecEvents] = useState([])
  const [allTAData, setTAData] = useState([]);
  const [allPatientData, setPatientData] = useState([]);
  const [showDeleteRecurringModal, setShowDeleteRecurringModal] = useState(false)
  const [showEditModal, setShowEditModal] =
    useState(false);
  // var copiedRoutineName = ''
  
  useEffect(() => {
    // props.setEvents([]);
    // props.setGetActionsEndPoint({});
    // props.setGetStepsEndPoint({});
    props.setEvents({});
  }, [props.theCurrentUserID, props.stateValue.dateContext, props.editEvent]);

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

        const filteredRecEvents = Array.from(
          new Set(temp.map((a) => a.recurringEventId))
        ).map((recurringEventId) => {
          return temp.find((a) => a.recurringEventId === recurringEventId);
        });
        const filteredNonRecEvents = Array.from(
          new Set(temp.filter((a) => !a.recurringEventId))
        );
        const filteredEvents = filteredRecEvents.concat(filteredNonRecEvents);
        console.log('recurring', filteredRecEvents);
        console.log('recurring', filteredNonRecEvents);
        console.log('recurring', filteredEvents);
        filteredEvents.sort((a, b) => {
          // console.log('a = ', a, '\nb = ', b);
          const [a_start, b_start] = [
            a['start']['dateTime'],
            b['start']['dateTime'],
          ];
          console.log('a_start = ', a_start, '\nb_start = ', b_start);
          const [a_end, b_end] = [a['end']['dateTime'], b['end']['dateTime']];
          console.log('a_end = ', a_end, '\nb_end = ', b_end);
          const [a_start_time, b_start_time] = getTimes(
            a['start']['dateTime'],
            b['start']['dateTime']
          );
          const [a_end_time, b_end_time] = getTimes(
            a['end']['dateTime'],
            b['end']['dateTime']
          );
          console.log('a_start_time = ', a_start_time, '\nb_start_time = ', b_start_time); 
          console.log('a_end_time = ', a_end_time, '\nb_end_time = ', b_end_time); 
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
      console.log('recurring', filteredEvents);
      //setActions(temp);
      setActions(filteredEvents);
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
  const displayActions = (instance) => {
    console.log('displayActions', instance);
    
      return (
        <div>
          
          {instance.map((r) => {
            return (
              <ListGroup.Item
                key={r.id}
                style={{ backgroundColor: '#d1dceb', marginTop: '1px' }}
                onClick={() => {
                  //  props.sethighLight(r["summary"])
                  console.log('ListGroup', r['summary']);
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-evenly' }}
                >
                  <div
                    flex="1"
                    style={{
                      marginLeft: '1rem',
                      marginTop: '0.5rem',
                      height: '4.5rem',
                      borderRadius: '10px',
                      width: '60%',
                      display: 'flex',
                      justifyContent: 'space-between',

                      boxShadow:
                        '0 16px 28px 0 rgba(0, 0, 0, 0.2), 0 16px 20px 0 rgba(0, 0, 0, 0.19)',

                      backgroundColor: '#67ABFC',
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
                            {moment(r.start.dateTime).format('MMM DD, hh:mm')}-
                            {moment(r.end.dateTime).format('MMM DD, hh:mm')}
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
                        {console.log(r.summary)}
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
                          <FontAwesomeIcon
                            style={{ cursor: 'pointer', color: 'white' }}
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
                    </div>
                    <div
                      style={{
                        marginRight: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div>
                        <FontAwesomeIcon
                          title="Edit Item"
                          onMouseOver={(event) => {
                            event.target.style.color = '#48D6D2';
                          }}
                          onMouseOut={(event) => {
                            event.target.style.color = '#FFFFFF';
                          }}
                          style={{ color: '#ffffff', cursor: 'pointer' }}
                          icon={faEdit}
                          onClick={(e) => {
                            openEditModal(r);
                            {
                              console.log(r);
                            }
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
                          icon={faTrashAlt}
                          onClick={(e) => {
                            openDeleteRecurringModal(r);
                          }}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            );
            })}
        </div>
      );
  }
  function formatDateTime(str) {
    let newTime = new Date(str).toLocaleTimeString();
    return newTime.replace(/:\d+ /, ' ');
  }

  function getIsAvailableFromGR(r) {
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
  const openInstances = (r) =>{
    let url = BASE_URL + 'googleRecurringInstances/';
    let id = currentUser;
    let eventId = r.recurringEventId;
    
    axios
    .post(url + id.toString() + ',' + eventId.toString())
    .then((response) => {
      console.log('/googleRecurringInstances: ', response.data);
      const temp = [];
      for (var i = 0; i < response.data.length; i++) {
        temp.push(response.data[i]);
      }
      console.log('/googleRecurringInstances: ', temp);
      setRecEvents(temp)
      setRec(true)
    });
    var tempRows = [];
    var tempID = [];
    var tempIsID = [];
    console.log('only 0.1.0', getRecEvents);
    const uniqueObjects = [
      ...new Map(getRecEvents.map((item) => [item.id, item])).values(),
    ];
    console.log('unique obj', uniqueObjects, getRecEvents);
    for (var i = 0; i < uniqueObjects.length; i++) {
      tempRows.push(displayActions(getRecEvents[i]));
      console.log('p.ggep[i] = ', getRecEvents[i].id);
    }
    console.log('tempRows', tempRows, tempID);
    setRecList(tempRows);
    
   }

  const openDeleteRecurringModal = (r) => {
    console.log('opendeleterecurringmodal called',r);
    if (r.recurringEventId === undefined) {
      console.log('opendeleterecurringmodal nonre', r);
      deleteTheCalenderEvent(r.id);
      alert('Deleted');
    }
    else{
    console.log('opendeleterecurringmodal rec', r);
    props.setStateValue((prevState) => {
      return {
        ...prevState,
        showDeleteRecurringModal: !showDeleteRecurringModal,
      };
    });
     props.setStateValue((prevState) => {
       return {
         ...prevState,
         originalEvents: r,
       };
     });}
  };
  const openEditModal = (r) => {
    console.log('openeditmodal called', r);
    
      console.log('opendeletemodal rec', r);
      props.setStateValue((prevState) => {
        return {
          ...prevState,
          showEditModal: !showEditModal,
        };
      });
      props.setStateValue((prevState) => {
        return {
          ...prevState,
          originalEvents: r,
        };
      });
  };

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
    return (
      <div>
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
                    return '#3a92fb';
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
                      {/* {formatDateTime(r.start.dateTime)}-
                      {formatDateTime(r.end.dateTime)} */}
                      {moment(r.start.dateTime).format('MMM DD, hh:mm')}-
                      {moment(r.end.dateTime).format('MMM DD, hh:mm')}
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
                      style={{ cursor: 'pointer', color: 'white' }}
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
                  <FontAwesomeIcon
                    title="Edit Item"
                    onMouseOver={(event) => {
                      event.target.style.color = '#48D6D2';
                    }}
                    onMouseOut={(event) => {
                      event.target.style.color = '#FFFFFF';
                    }}
                    style={{ color: '#ffffff', cursor: 'pointer' }}
                    icon={faEdit}
                    onClick={(e) => {
                      //callEdit(r['id']);
                      openEditModal(r);
                    }}
                  />
                </div>
                {/* working on this thing */}

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
                    onClick={(e) => {
                      //callDelete(r['id']);
                      openDeleteRecurringModal(r);
                    }}
                    size="sm"
                  />
                </div>

                <div style={{ flex: '1' }}>
                  {r.recurringEventId !== undefined ? (
                    <div>
                      <FontAwesomeIcon
                        title="Delete Item 1"
                        onMouseOver={(event) => {
                          event.target.style.color = '#48D6D2';
                        }}
                        onMouseOut={(event) => {
                          event.target.style.color = '#FFFFFF';
                        }}
                        style={{ color: '#FFFFFF', cursor: 'pointer' }}
                        icon={faList}
                        onClick={(e) => {
                          openInstances(r);
                          //setRec(!rec);
                        }}
                        size="sm"
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ListGroup.Item>
      </div>
    );
    //    }
  }

  return (
    <row>
      {/* {makeDisplays()} */}
      {/* {getCurrentUser()} */}
      {listOfBlocks}
      {/* {recList} */}
      {console.log(rec, recList)}
      <div>{rec ? <div>{displayActions(getRecEvents)}</div> : <div></div>}</div>
    </row>
  );
}
