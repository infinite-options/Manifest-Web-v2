import React, { useState, useEffect, useContext } from 'react';
import {
  signInToGoogle,
  initClient,
  getSignedInUserEmail,
  signOutFromGoogle,
  publishTheCalenderEvent,
} from './GoogleApiService';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Dropdown,
  DropdownButton,
  Spinner,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LoginContext from '../LoginContext';
import EditEventContext from './EditEventContext';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';

export default function GoogleEventComponent(props) {
  //const classes = useStyles();
  console.log('in add events', props);
  const loginContext = useContext(LoginContext);
  const editingEventContext = useContext(EditEventContext);
  const user = props.CurrentId;
  var userID = '';
  var userTime_zone = '';
  var userEmail = '';
  if (
    document.cookie
      .split(';')
      .some((item) => item.trim().startsWith('patient_uid='))
  ) {
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
  } else {
    userID = loginContext.loginState.curUser;
    userTime_zone = loginContext.loginState.curUserTimeZone;
    userEmail = loginContext.loginState.curUserEmail;
  }
  console.log('in add events', userEmail);
  console.log('in add events', document.cookie);
  console.log('in add events', userID);
  const [signedin, setSignedIn] = useState(false);
  const [googleAuthedEmail, setgoogleAuthedEmail] = useState(null);
  const [summary, setSummary] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [repeatOptionDropDown, setRepeatOptionDropDown] =useState('Does not repeat');
  const [repeatOption, setRepeatOption] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [repeatDropDown , setRepeatDropDown]= useState('DAY');
  const [repeatDropDown_temp , setRepeatDropDown_temp]= useState('DAY');
  const [repeatMonthlyDropDown, setRepeatMonthlyDropDown] =
    useState('Monthly on day 13');
  const [repeatInputValue , setRepeatInputValue]= useState('1');
  const [repeatInputValue_temp , setRepeatInputValue_temp]= useState('1');
  const [repeatOccurrence , setRepeatOccurrence]= useState('1');
  const [repeatOccurrence_temp , setRepeatOccurrence_temp]= useState('1');
  const [repeatRadio , setRepeatRadio]= useState('Never');
  const [repeatRadio_temp , setRepeatRadio_temp]= useState('Never');
  const [repeatEndDate , setRepeatEndDate]= useState('');
  const [repeatEndDate_temp , setRepeatEndDate_temp]= useState('');
  const [showNoTitleError , setShowNoTitleError]= useState('');
  const [showDateError , setShowDateError]= useState('');
  const [byDay , setByDay]= useState({
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
      });
  const [byDay_temp,setByDay_temp]= useState({
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
      });
  const [repeatSummary, setRepeatSummary]= useState('');
  const [recurrenceRule, setRecurrenceRule]= useState('');
  const [eventNotifications, setEventNotifications]= useState({});
  const [showDeleteRecurringModal, setShowDeleteRecurringModal]= useState(false);
  const [deleteRecurringOption, setDeleteRecurringOption]= useState('This event');
  const [showEditRecurringModal, setShowEditRecurringModal]= useState(false);
  const [editRecurringOption, setEditRecurringOption]= useState('');








  useEffect(() => {
    initClient((success) => {
      if (success) {
        getGoogleAuthorizedEmail();
      }
    });
  }, []);

  const startTimePicker = () => {
    return (
      <DatePicker
        className="form-control"
        type="text"
        selected={startTime}
        onChange={(date) => {
          setStartTime(date);
        }}
        showTimeSelect
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
      />
    );
  };

  const endTimePicker = () => {
    return (
      <DatePicker
        className="form-control"
        type="text"
        style={{ width: '100%' }}
        selected={endTime}
        onChange={(date) => {
          setEndTime(date);
        }}
        showTimeSelect
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
      />
    );
  };

  const openRepeatModal = () => {
    setShowRepeatModal((prevState) => {
      return { showRepeatModal: !prevState.showRepeatModal };
    });
  };

  const closeRepeatModal = () => {

     setShowRepeatModal(false);
     setRepeatInputValue_temp((prevState) => {
       return {
         ...prevState,
         repeatInputValue_temp: prevState.repeatInputValue, 
       };
     });
     setRepeatOccurrence_temp((prevState) => {
       return {
         ...prevState,
         repeatOccurrence_temp: prevState.repeatOccurrence, 
       };
     });
     setRepeatDropDown_temp((prevState) => {
       return {
         ...prevState,
         repeatDropDown_temp: prevState.repeatDropDown, 
       };
     });
     setRepeatRadio_temp((prevState) => {
       return {
         ...prevState,
         repeatRadio_temp: prevState.repeatRadio, 
       };
     });
     setRepeatEndDate_temp((prevState) => {
       return {
         ...prevState,
         repeatEndDate_temp: prevState.repeatEndDate, 
       };
     });
     setByDay_temp((prevState) => {
       return {
         ...prevState,
         byDay_temp: prevState.byDay, 
       };
     });
    
    if (
      !repeatOption && repeatOptionDropDown === 'Custom...'
    ) {
      setRepeatOptionDropDown('Does not repeat')
    }
  };

  const handleRepeatDropDown = (eventKey, week_days) => {
    if (eventKey === 'WEEK') {
      const newByDay = {
        ...byDay_temp,
        [startTime.getDay()]:
          week_days[startTime.getDay()],
      };
      setRepeatDropDown_temp(eventKey);
      setByDay_temp(newByDay);
      
    }
     setRepeatDropDown_temp(eventKey);
  };

  const handleRepeatMonthlyDropDown = (eventKey) => {
    setRepeatMonthlyDropDown(eventKey)
  };

  const handleRepeatEndDate = (date) => {
    setRepeatEndDate_temp(date)
  };

  const handleRepeatInputValue = (eventKey) => {
    setRepeatInputValue_temp(eventKey);
  };

  const handleRepeatOccurrence = (eventKey) => {
    setRepeatOccurrence_temp(eventKey);
  };

  const saveRepeatChanges = () => {
    // const {
    //   // repeatOptionDropDown,
    //   repeatDropDown_temp,
    //   repeatInputValue_temp,
    //   repeatOccurrence_temp,
    //   repeatRadio_temp,
    //   repeatEndDate_temp,
    //   byDay_temp,
    // } = '';
    setShowRepeatModal(false);
    setRepeatOption(true);
    setRepeatInputValue((prevState) => {
      return {
        ...prevState,
        repeatInputValue: prevState.repeatInputValue_temp, 
      };
    });
    setRepeatOccurrence((prevState) => {
      return {
        ...prevState,
        repeatOccurrence: prevState.repeatOccurrence_temp, 
      };
    });
    setRepeatDropDown((prevState) => {
      return {
        ...prevState,
        repeatDropDown: prevState.repeatDropDown_temp, 
      };
    });
    setRepeatRadio((prevState) => {
      return {
        ...prevState,
        repeatRadio: prevState.repeatRadio_temp, 
      };
    });
    setRepeatEndDate((prevState) => {
      return {
        ...prevState,
        repeatEndDate: prevState.repeatEndDate_temp, 
      };
    });
    setByDay((prevState) => {
      return {
        ...prevState,
        byDay: prevState.byDay_temp, 
      };
    });
    // ((prevState) => ({
    //   showRepeatModal: false,
    //   repeatOption: true,
    //   repeatInputValue: prevState.repeatInputValue_temp,
    //   repeatOccurrence: prevState.repeatOccurrence_temp,
    //   repeatDropDown: prevState.repeatDropDown_temp,
    //   repeatRadio: prevState.repeatRadio_temp,
    //   repeatEndDate: prevState.repeatEndDate_temp,
    //   byDay: prevState.byDay_temp,
    // }));

    // If repeatDropDown_temp is DAY
    console.log(repeatDropDown_temp);
    console.log(repeatInputValue_temp);
    if (repeatDropDown_temp === 'Day') {
      if (repeatInputValue_temp === '1') {
        if (repeatRadio_temp === 'Never') {
          setRepeatOptionDropDown('Daily');
          setRecurrenceRule('RRULE:FREQ=DAILY;INTERVAL=1');
        } else if (repeatRadio_temp === 'On') {
          setRepeatOptionDropDown(`Daily, until ${moment(repeatEndDate_temp).format('YYYYMMDD')}`);
          setRecurrenceRule(
            `RRULE:FREQ=DAILY;INTERVAL=1;UNTIL=${moment(
              repeatEndDate_temp
            ).format('YYYYMMDD')}`
          );
        } else {
          if (repeatOccurrence_temp === '1') {
            setRepeatOptionDropDown(`Once`);
            setRecurrenceRule(`RRULE:FREQ=DAILY;INTERVAL=1;COUNT=1')}`);
          } else {
            setRepeatOptionDropDown(`Daily, ${repeatOccurrence_temp} times`);
            setRecurrenceRule(
              `RRULE:FREQ=DAILY;INTERVAL=1;COUNT=${repeatOccurrence_temp}`
            );
          }
        }
      } else {
        if (repeatRadio_temp === 'Never') {
          setRepeatOptionDropDown(`Every ${repeatInputValue_temp} days`);
          setRecurrenceRule(
            `RRULE:FREQ=DAILY;INTERVAL=${repeatInputValue_temp}`
          );
        } else if (repeatRadio_temp === 'On') {
          setRepeatOptionDropDown(`Every ${repeatInputValue_temp} days, until ${moment(repeatEndDate_temp).format('YYYYMMDD')}`);
          setRecurrenceRule(
            `RRULE:FREQ=DAILY;INTERVAL=${repeatInputValue_temp};UNTIL=${moment(repeatEndDate_temp).format('YYYYMMDD')}`);
        } else {
          if (repeatOccurrence_temp === '1') {
            setRepeatOptionDropDown(`Once`);
            setRecurrenceRule(`RRULE:FREQ=DAILY;COUNT=1`);
          } else {
            setRepeatOptionDropDown(`Every ${repeatInputValue_temp} days, ${repeatOccurrence_temp} times`);
            setRecurrenceRule(`RRULE:FREQ=DAILY;INTERVAL=${repeatInputValue_temp};COUNT=${repeatOccurrence_temp}`);
          }
        }
      }
    }

    // If repeatDropDown_temp is WEEK
    else if (repeatDropDown_temp === 'WEEK') {
      let selectedDays = [];
      for (let [key, value] of Object.entries(byDay_temp)) {
        value !== '' && selectedDays.push(value);
      }
      let selectedDaysRecurrence = [];
      for (let [key, value] of Object.entries(byDay_temp)) {
        value !== '' && selectedDaysRecurrence.push(value.substring(0, 2).toUpperCase());
      }
      console.log(selectedDays, 'selectedDays week');
      if (repeatInputValue_temp === '1') {
        if (repeatRadio_temp === 'Never') {
          if (selectedDays.length === 7) {
            setRepeatOptionDropDown('Weekly on all days');
            setRecurrenceRule('RRULE:FREQ=WEEKLY;INTERVAL=1');
          } else {
            setRepeatOptionDropDown(`Weekly on ${selectedDays.join(', ')}`);
            setRecurrenceRule(
              `RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=${selectedDaysRecurrence.join(',')}`
            );
          }
        } else if (repeatRadio_temp === 'On') {
          if (selectedDays.length === 7) {
            setRepeatOptionDropDown(`Weekly on all days, until ${moment(repeatEndDate_temp).format('LL')}`);
            setRecurrenceRule(
              `RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=${moment(
                repeatEndDate_temp
              ).format('YYYYMMDD')}`
            );
          } else {
            setRepeatOptionDropDown(`Weekly on ${selectedDays.join(', ')}, until ${moment(repeatEndDate_temp).format('LL')}`);
            setRecurrenceRule(`RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=${selectedDaysRecurrence.join(',')};UNTIL=${moment(repeatEndDate_temp).format('YYYYMMDD')}`);
          }
        } else {
          if (repeatOccurrence_temp === '1') {
            setRepeatOptionDropDown(`Once`);
            setRecurrenceRule(
              `RRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=1`);
          } else {
            if (selectedDays.length === 7) {
              setRepeatOptionDropDown(`Weekly on all days, , ${repeatOccurrence_temp} times`);
              setRecurrenceRule(
                `RRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=${repeatOccurrence_temp}`
              );
            } else {
              setRepeatOptionDropDown(`Weekly on ${selectedDays.join(', ')}, ${repeatOccurrence_temp} times`);
              setRecurrenceRule(
                `RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=${selectedDaysRecurrence.join(
                  ','
                )};COUNT=${repeatOccurrence_temp}`
              );
            }
          }
        }
      } else {
        if (repeatRadio_temp === 'Never') {
          if (selectedDays.length === 7) {
            setRepeatOptionDropDown(`Every ${repeatInputValue_temp} weeks on all days`);
            setRecurrenceRule(
              `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp}`
            );
          } else {
            setRepeatOptionDropDown(`Every ${repeatInputValue_temp} weeks on ${selectedDays.join(', ')}`);
            setRecurrenceRule(
              `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};BYDAY=${selectedDaysRecurrence.join(
                ','
              )};`
            );
          }
        } else if (repeatRadio_temp === 'On') {
          if (selectedDays.length === 7) {
            setRepeatOptionDropDown(`Every ${repeatInputValue_temp} weeks on all days, until ${moment( repeatEndDate_temp).format('LL')}`);
            setRecurrenceRule(
              `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};UNTIL=${moment(
                repeatEndDate_temp
              ).format('YYYYMMDD')}`
            );
          } else {
            setRepeatOptionDropDown(`Every ${repeatInputValue_temp} weeks on ${selectedDays.join(', ')}, until ${moment(repeatEndDate_temp).format('LL')}`);
            setRecurrenceRule(
              `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};BYDAY=${selectedDaysRecurrence.join(
                ','
              )};UNTIL=${moment(repeatEndDate_temp).format('YYYYMMDD')}`
            );
          }
        } else {
          if (repeatOccurrence_temp === '1') {
            setRepeatOptionDropDown('Once');
            setRecurrenceRule(
              `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};COUNT=1`
            );
          } else {
            if (selectedDays.length === 7) {
              setRepeatOptionDropDown(`Every ${repeatInputValue_temp} weeks on all days, ${repeatOccurrence_temp} times`);
              setRecurrenceRule(
                `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};COUNT=${repeatOccurrence_temp}`
              );
            } else {
              setRepeatOptionDropDown(`Every ${repeatInputValue_temp} weeks on ${selectedDays.join(', ')}, ${repeatOccurrence_temp} times`);
              setRecurrenceRule(
                `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};BYDAY=${selectedDaysRecurrence.join(
                  ','
                )};COUNT=${repeatOccurrence_temp}`
              );
            }
          }
        }
      }
    }

    // If repeatDropDown_temp is MONTH
    else if (repeatDropDown_temp === 'Month') {
      if (repeatInputValue_temp === '1') {
        if (repeatRadio_temp === 'Never') {
          setRepeatOptionDropDown('Monthly');
        } else if (repeatRadio_temp === 'On') {
          setRepeatOptionDropDown(`Monthly, until ${moment(repeatEndDate_temp).format('LL')}`);
        } else {
          if (repeatOccurrence_temp === '1') {
            setRepeatOptionDropDown(`Once`);
          } else {
            setRepeatOptionDropDown(`Monthly, ${repeatOccurrence_temp} times`);
          }
        }
      } else {
        if (repeatRadio_temp === 'Never') {
          setRepeatOptionDropDown(`Every ${repeatInputValue_temp} months`);
        } else if (repeatRadio_temp === 'On') {
          setRepeatOptionDropDown(`Every ${repeatInputValue_temp} months, until ${moment(repeatEndDate_temp).format('LL')}`);
        } else {
          if (repeatOccurrence_temp === '1') {
            setRepeatOptionDropDown(`Once`);
          } else {
            setRepeatOptionDropDown(`Every ${repeatInputValue_temp} months, ${repeatOccurrence_temp} times`);
          }
        }
      }
    }

    // If repeatDropDown_temp is YEAR
    else if (repeatDropDown_temp === 'Year') {
      if (repeatInputValue_temp === '1') {
        if (repeatRadio_temp === 'Never') {
          setRepeatOptionDropDown('Annually',);
        } else if (repeatRadio_temp === 'On') {
          setRepeatOptionDropDown(`Annually, until ${moment(repeatEndDate_temp).format('LL')}`,);
        } else {
          if (repeatOccurrence_temp === '1') {
            setRepeatOptionDropDown(`Once`);
          } else {
            setRepeatOptionDropDown(`Annually, ${repeatOccurrence_temp} times`);
          }
        }
      } else {
        if (repeatRadio_temp === 'Never') {
          setRepeatOptionDropDown(`Every ${repeatInputValue_temp} years`);
        } else if (repeatRadio_temp === 'On') {
          setRepeatOptionDropDown(`Every ${repeatInputValue_temp} years, until ${moment(repeatEndDate_temp).format('LL')}`);
        } else {
          if (repeatOccurrence_temp === '1') {
            setRepeatOptionDropDown(`Once`);
          } else {
            setRepeatOptionDropDown(`Every ${repeatInputValue_temp} years, ${repeatOccurrence_temp} times`);
          }
        }
      }
    }
    console.log(showRepeatModal)
  };


  const repeatModal = () => {
    // const [title, setTitle] = useState("DAY");
    // const [monthly, setMonthly] = useState("Monthly on day 13");
    // const [endDate, setEndDate] = useState(state.newEventStart0);
    // const [inputValue, setInputValue] = useState(1);

    const week_days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    // Custom styles
    const modalStyle = {
      position: 'absolute',
      zIndex: '5',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
    };

    const inputStyle = {
      padding: '8px 5px 8px 15px',
      marginLeft: '8px',
      background: '#F8F9FA',
      border: 'none',
      width: '70px',
      borderRadius: '4px',
      marginRight: '8px',
    };

    const selectStyle = {
      display: 'inline-block',
    };

    const weekStyle = {
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      marginTop: '10px',
    };

    // const radioInputStyle = { display: "flex", alignItems: "center" };

    // onClick event handler for the circles
    const selectedDot = (e, index) => {
      let curClass = e.target.classList;
      if (curClass.contains('selected')) {
        curClass.remove('selected');
        const newByDay = { ...byDay_temp, [index]: '' };
       setByDay_temp(newByDay);
      } else {
        curClass.add('selected');
        const newByDay = {
          ...byDay_temp,
          [index]: week_days[index],
        };
       setByDay_temp(newByDay);
      }
    };

    let selectedDays = [];
    for (let [key, value] of Object.entries(byDay_temp)) {
      if (value !== '') selectedDays.push(key);
    }
    // If selected repeat every week, the following shows.
    const weekSelected = (
      <>
        Repeat On
        <div style={weekStyle}>
          {week_days.map((day, i) => {
            if (selectedDays.includes(i.toString())) {
              return (
                <span
                  key={i}
                  className="dot selected"
                  style={{cursor:'pointer', padding:'1rem'}}
                  onClick={(e) => selectedDot(e, i)}
                >
                  {day.charAt(0)}
                </span>
              );
            } else {
              return (
                <span
                  key={i}
                  className="dot"
                  style={{ cursor: 'pointer', padding: '1rem' }}
                  onClick={(e) => selectedDot(e, i)}
                >
                  {day.charAt(0)}
                </span>
              );
            }
          })}
        </div>
      </>
    );

    // If selected repeat every month, the following shows.
    // const monthSelected = (
    //   <DropdownButton
    //     title={repeatMonthlyDropDown}
    //     variant="light"
    //     style={{ marginTop: "20px" }}
    //   >
    //     <Dropdown.Item
    //       eventKey="Monthly on day 13"
    //       onSelect={eventKey => this.handleRepeatMonthlyDropDown(eventKey)}
    //     >
    //       Monthly on day 13
    //     </Dropdown.Item>
    //     <Dropdown.Item
    //       eventKey="Monthly on the second Friday"
    //       onSelect={eventKey => this.handleRepeatMonthlyDropDown(eventKey)}
    //     >
    //       Monthly on the second Friday
    //     </Dropdown.Item>
    //   </DropdownButton>
    // );

    return (
      <Modal.Dialog style={modalStyle}>
        <Modal.Header closeButton onHide={closeRepeatModal}>
          <Modal.Title>
            <h5 className="normalfancytext">Repeating Options test</h5>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '5px',
              }}
            >
              Repeat every
              <input
                type="number"
                min="1"
                max="10000"
                value={repeatInputValue_temp}
                style={inputStyle}
                onChange={(e) => handleRepeatInputValue(e.target.value)}
              />
              <DropdownButton
                title={repeatDropDown_temp}
                style={selectStyle}
                variant="light"
              >
                <Dropdown.Item
                  eventKey="Day"
                  onSelect={(eventKey) => handleRepeatDropDown(eventKey)}
                >
                  day
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="WEEK"
                  onSelect={(eventKey) =>
                    handleRepeatDropDown(eventKey, week_days)
                  }
                >
                  week
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="MONTH"
                  onSelect={(eventKey) => handleRepeatDropDown(eventKey)}
                >
                  month
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="YEAR"
                  onSelect={(eventKey) => handleRepeatDropDown(eventKey)}
                >
                  year
                </Dropdown.Item>
              </DropdownButton>
            </Form.Group>
            <Form.Group style={{ marginLeft: '5px' }}>
              {repeatDropDown_temp === 'WEEK' && weekSelected}
            </Form.Group>
            {/* {repeatDropDown === "MONTH" && monthSelected} */}
            <Form.Group
              style={{
                height: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginTop: '20px',
                marginLeft: '5px',
              }}
              className="repeat-form"
              onChange={(e) => {
                if (e.target.type === 'radio') {
                  setRepeatRadio_temp(e.target.value)
                }
              }}
            >
              Ends
              <Form.Check type="radio">
                <Form.Check.Label style={{ marginLeft: '5px' }}>
                  <Form.Check.Input
                    type="radio"
                    value="Never"
                    name="radios"
                    defaultChecked={
                      repeatRadio_temp === 'Never' && true
                    }
                  />
                  Never
                </Form.Check.Label>
              </Form.Check>
              <Form.Check type="radio">
                <Form.Check.Label style={{ marginLeft: '5px' }}>
                  <Form.Check.Input
                    type="radio"
                    name="radios"
                    value="On"
                    style={{ marginTop: '10px' }}
                    defaultChecked={
                      repeatRadio_temp === 'On' && true
                    }
                  />
                  Until
                  <DatePicker
                    className="date-picker-btn btn btn-light"
                    selected={repeatEndDate_temp}
                    onChange={(date) =>handleRepeatEndDate(date)}
                  ></DatePicker>
                </Form.Check.Label>
              </Form.Check>
              <Form.Check type="radio">
                <Form.Check.Label style={{ marginLeft: '5px' }}>
                  <Form.Check.Input
                    type="radio"
                    name="radios"
                    value="After"
                    style={{ marginTop: '12px' }}
                    defaultChecked={
                      repeatRadio_temp === 'After' && true
                    }
                  />
                  After
                  <span style={{ marginLeft: '60px' }}>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={repeatOccurrence_temp}
                      onChange={(e) =>
                        handleRepeatOccurrence(e.target.value)
                      }
                      style={inputStyle}
                      className="input-exception"
                    />
                    occurrence(s)
                  </span>
                </Form.Check.Label>
              </Form.Check>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeRepeatModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveRepeatChanges}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  };
  const getGoogleAuthorizedEmail = async () => {
    let email = await getSignedInUserEmail();
    if (email) {
      setSignedIn(true);
      setgoogleAuthedEmail(email);
    }
  };
  const getAuthToGoogle = async () => {
    let successfull = await signInToGoogle();
    if (successfull) {
      getGoogleAuthorizedEmail();
    }
  };
  const _signOutFromGoogle = () => {
    let status = signOutFromGoogle();
    if (status) {
      setSignedIn(false);
      setgoogleAuthedEmail(null);
    }
  };
  const submit = (e) => {
    
    e.preventDefault();
    console.log(repeatOptionDropDown)
    console.log(recurrenceRule);
    var event = {
      summary,
      description,
      location,

      start: {
        dateTime: moment(startTime),
        timeZone: userTime_zone,
      },
      end: {
        dateTime: moment(endTime),
        timeZone: userTime_zone,
      },
      recurrence: repeatOption ? [recurrenceRule] : false,
      attendees: [{ email: attendees }],
    };
    publishTheCalenderEvent(event);
    editingEventContext.setEditingEvent({
      ...editingEventContext.editingEvent,
      editing: false,
    });
  };

  return (
    <div className="calenderEvent-wrapper">
      <div className="header">
        <h1>Add an event to google Calender</h1>
      </div>
      {!signedin ? (
        <div className="google-login">
          <p>Login in to Google</p>
          <button onClick={() => getAuthToGoogle()}>Sign In</button>
        </div>
      ) : (
        <div className="body">
          <form>
            <div className="eventItem">
              <label>summary</label>
              <input
                placeholder="summary..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              >
                {console.log('in add events', userEmail)}
              </input>
            </div>
            <div className="eventItem">
              <label>Description</label>
              <input
                placeholder="description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></input>
            </div>
            <div className="eventItem">
              <label>Start Time</label>
              {/* <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              ></input> */}
              {startTimePicker()}
            </div>
            <div className="eventItem">
              <label>End Time</label>
              {/* <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              ></input> */}
              {endTimePicker()}
            </div>
            <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
              <Form.Label>Repeating Options</Form.Label>
              <DropdownButton
                className="repeatOptionDropDown"
                // onClick={this.openRepeatModal}
                title={repeatOptionDropDown}
                variant="light"
              >
                <Dropdown.Item
                  eventKey="Does not repeat"
                  onSelect={(eventKey) =>
                    // this.setState({
                    //   repeatOptionDropDown: eventKey,
                    //   repeatOption: false,
                    // })
                    {
                      setRepeatOptionDropDown(eventKey);
                      setRecurrenceRule()
                      setRepeatOption(false);
                    }
                  }
                >
                  Does not repeat
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Custom..."
                  onSelect={(eventKey) => {
                    openRepeatModal();
                    // this.setState({ repeatOptionDropDown: eventKey });
                  }}
                >
                  Custom...
                </Dropdown.Item>
              </DropdownButton>
            </Form.Group>
            <div>
              {
                showRepeatModal && repeatModal()
                // <RepeatModal
                //   closeRepeatModal={this.closeRepeatModal}
                //   todayObject={todayDateObject}
                //   newEventStart0={newEventStart0}
                // />
              }
            </div>
            <div className="eventItem">
              <label>Attendees</label>
              <input
                type="text"
                placeholder="attendees..."
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
              ></input>
            </div>
            <div className="eventItem">
              <label>Location</label>
              <input
                placeholder="location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              ></input>
            </div>
            <button type="submit" onClick={(e) => submit(e)}>
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
