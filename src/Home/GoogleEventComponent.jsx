import React, { useState, useEffect, useContext } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap';
import axios from 'axios';
import trash from '../manifest/LoginAssets/Trash.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';
import LoginContext from '../LoginContext';
import EditEventContext from './EditEventContext';
import moment from 'moment';

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

export default function GoogleEventComponent(props) {
  //const classes = useStyles();
  console.log('in add events', props);
  const loginContext = useContext(LoginContext);

  console.log('in events', loginContext);
  const editingEventContext = useContext(EditEventContext);
  const user = props.CurrentId;
  var userID = '';
  var userTime_zone = '';
  var userEmail = '';
  var userPic = '';
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
    userPic = document.cookie
      .split('; ')
      .find((row) => row.startsWith('patient_pic='))
      .split('=')[1];
  } else {
    userID = loginContext.loginState.curUser;
    userTime_zone = loginContext.loginState.curUserTimeZone;
    userEmail = loginContext.loginState.curUserEmail;
    userPic = loginContext.loginState.curUserPic;
  }
  console.log('in add events', userEmail);
  console.log('in add events', document.cookie);
  console.log('in add events', userID);

  const [summary, setSummary] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [repeatOptionDropDown, setRepeatOptionDropDown] =
    useState('Does not repeat');
  const [repeatOption, setRepeatOption] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [repeatDropDown, setRepeatDropDown] = useState('DAY');
  const [repeatDropDown_temp, setRepeatDropDown_temp] = useState('DAY');
  const [repeatMonthlyDropDown, setRepeatMonthlyDropDown] =
    useState('Monthly on day 13');
  const [repeatInputValue, setRepeatInputValue] = useState('1');
  const [repeatInputValue_temp, setRepeatInputValue_temp] = useState('1');
  const [repeatOccurrence, setRepeatOccurrence] = useState('1');
  const [repeatOccurrence_temp, setRepeatOccurrence_temp] = useState('1');
  const [repeatRadio, setRepeatRadio] = useState('Never');
  const [repeatRadio_temp, setRepeatRadio_temp] = useState('Never');
  const [repeatEndDate, setRepeatEndDate] = useState('');
  const [repeatEndDate_temp, setRepeatEndDate_temp] = useState('');

  const [byDay, setByDay] = useState({
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
  });
  const [byDay_temp, setByDay_temp] = useState({
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
  });
  const [recurrenceRule, setRecurrenceRule] = useState('');
  const [reminderMethod, setReminderMethod] = useState('');
  const [reminderMinutes, setReminderMinutes] = useState('');

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
  const startTimePicker = () => {
    return (
      <DatePicker
        wrapperClassName="datePicker"
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
        wrapperClassName="datePicker"
        className="form-control"
        type="text"
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

    if (!repeatOption && repeatOptionDropDown === 'Custom...') {
      setRepeatOptionDropDown('Does not repeat');
    }
  };

  const handleRepeatDropDown = (eventKey, week_days) => {
    if (eventKey === 'WEEK') {
      const newByDay = {
        ...byDay_temp,
        [startTime.getDay()]: week_days[startTime.getDay()],
      };
      setRepeatDropDown_temp(eventKey);
      setByDay_temp(newByDay);
    }
    setRepeatDropDown_temp(eventKey);
  };

  const handleRepeatMonthlyDropDown = (eventKey) => {
    setRepeatMonthlyDropDown(eventKey);
  };

  const handleRepeatEndDate = (date) => {
    setRepeatEndDate_temp(date);
  };

  const handleRepeatInputValue = (eventKey) => {
    setRepeatInputValue_temp(eventKey);
  };

  const handleRepeatOccurrence = (eventKey) => {
    setRepeatOccurrence_temp(eventKey);
  };
  const handleReminderMinutes = (eventKey) => {
    setReminderMinutes(eventKey);
  };

  const saveRepeatChanges = () => {
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
    // }))

    // If repeatDropDown_temp is DAY
    console.log(repeatDropDown_temp);
    console.log(repeatInputValue_temp);
    if (repeatDropDown_temp === 'Day') {
      if (repeatInputValue_temp === '1') {
        if (repeatRadio_temp === 'Never') {
          setRepeatOptionDropDown('Daily');
          setRecurrenceRule('RRULE:FREQ=DAILY;INTERVAL=1');
        } else if (repeatRadio_temp === 'On') {
          setRepeatOptionDropDown(
            `Daily, until ${moment(repeatEndDate_temp).format('LL')}`
          );
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
          setRepeatOptionDropDown(
            `Every ${repeatInputValue_temp} days, until ${moment(
              repeatEndDate_temp
            ).format('LL')}`
          );
          setRecurrenceRule(
            `RRULE:FREQ=DAILY;INTERVAL=${repeatInputValue_temp};UNTIL=${moment(
              repeatEndDate_temp
            ).format('YYYYMMDD')}`
          );
        } else {
          if (repeatOccurrence_temp === '1') {
            setRepeatOptionDropDown(`Once`);
            setRecurrenceRule(`RRULE:FREQ=DAILY;COUNT=1`);
          } else {
            setRepeatOptionDropDown(
              `Every ${repeatInputValue_temp} days, ${repeatOccurrence_temp} times`
            );
            setRecurrenceRule(
              `RRULE:FREQ=DAILY;INTERVAL=${repeatInputValue_temp};COUNT=${repeatOccurrence_temp}`
            );
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
        value !== '' &&
          selectedDaysRecurrence.push(value.substring(0, 2).toUpperCase());
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
              `RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=${selectedDaysRecurrence.join(
                ','
              )}`
            );
          }
        } else if (repeatRadio_temp === 'On') {
          if (selectedDays.length === 7) {
            setRepeatOptionDropDown(
              `Weekly on all days, until ${moment(repeatEndDate_temp).format(
                'LL'
              )}`
            );
            setRecurrenceRule(
              `RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=${moment(
                repeatEndDate_temp
              ).format('YYYYMMDD')}`
            );
          } else {
            setRepeatOptionDropDown(
              `Weekly on ${selectedDays.join(', ')}, until ${moment(
                repeatEndDate_temp
              ).format('LL')}`
            );
            setRecurrenceRule(
              `RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=${selectedDaysRecurrence.join(
                ','
              )};UNTIL=${moment(repeatEndDate_temp).format('YYYYMMDD')}`
            );
          }
        } else {
          if (repeatOccurrence_temp === '1') {
            setRepeatOptionDropDown(`Once`);
            setRecurrenceRule(`RRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=1`);
          } else {
            if (selectedDays.length === 7) {
              setRepeatOptionDropDown(
                `Weekly on all days, , ${repeatOccurrence_temp} times`
              );
              setRecurrenceRule(
                `RRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=${repeatOccurrence_temp}`
              );
            } else {
              setRepeatOptionDropDown(
                `Weekly on ${selectedDays.join(
                  ', '
                )}, ${repeatOccurrence_temp} times`
              );
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
            setRepeatOptionDropDown(
              `Every ${repeatInputValue_temp} weeks on all days`
            );
            setRecurrenceRule(
              `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp}`
            );
          } else {
            setRepeatOptionDropDown(
              `Every ${repeatInputValue_temp} weeks on ${selectedDays.join(
                ', '
              )}`
            );
            setRecurrenceRule(
              `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};BYDAY=${selectedDaysRecurrence.join(
                ','
              )};`
            );
          }
        } else if (repeatRadio_temp === 'On') {
          if (selectedDays.length === 7) {
            setRepeatOptionDropDown(
              `Every ${repeatInputValue_temp} weeks on all days, until ${moment(
                repeatEndDate_temp
              ).format('LL')}`
            );
            setRecurrenceRule(
              `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};UNTIL=${moment(
                repeatEndDate_temp
              ).format('YYYYMMDD')}`
            );
          } else {
            setRepeatOptionDropDown(
              `Every ${repeatInputValue_temp} weeks on ${selectedDays.join(
                ', '
              )}, until ${moment(repeatEndDate_temp).format('LL')}`
            );
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
              setRepeatOptionDropDown(
                `Every ${repeatInputValue_temp} weeks on all days, ${repeatOccurrence_temp} times`
              );
              setRecurrenceRule(
                `RRULE:FREQ=WEEKLY;INTERVAL=${repeatInputValue_temp};COUNT=${repeatOccurrence_temp}`
              );
            } else {
              setRepeatOptionDropDown(
                `Every ${repeatInputValue_temp} weeks on ${selectedDays.join(
                  ', '
                )}, ${repeatOccurrence_temp} times`
              );
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
          setRepeatOptionDropDown(
            `Monthly, until ${moment(repeatEndDate_temp).format('LL')}`
          );
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
          setRepeatOptionDropDown(
            `Every ${repeatInputValue_temp} months, until ${moment(
              repeatEndDate_temp
            ).format('LL')}`
          );
        } else {
          if (repeatOccurrence_temp === '1') {
            setRepeatOptionDropDown(`Once`);
          } else {
            setRepeatOptionDropDown(
              `Every ${repeatInputValue_temp} months, ${repeatOccurrence_temp} times`
            );
          }
        }
      }
    }

    // If repeatDropDown_temp is YEAR
    else if (repeatDropDown_temp === 'Year') {
      if (repeatInputValue_temp === '1') {
        if (repeatRadio_temp === 'Never') {
          setRepeatOptionDropDown('Annually');
        } else if (repeatRadio_temp === 'On') {
          setRepeatOptionDropDown(
            `Annually, until ${moment(repeatEndDate_temp).format('LL')}`
          );
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
          setRepeatOptionDropDown(
            `Every ${repeatInputValue_temp} years, until ${moment(
              repeatEndDate_temp
            ).format('LL')}`
          );
        } else {
          if (repeatOccurrence_temp === '1') {
            setRepeatOptionDropDown(`Once`);
          } else {
            setRepeatOptionDropDown(
              `Every ${repeatInputValue_temp} years, ${repeatOccurrence_temp} times`
            );
          }
        }
      }
    }
    console.log(showRepeatModal);
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
      transform: 'translate(-50%, 0%)',
      width: '400px',
      color: '#D6B7FF',
    };

    const inputStyle = {
      padding: '8px 5px 8px 15px',
      marginLeft: '8px',
      background: '#F8F9FA',
      border: 'none',
      width: '70px',
      borderRadius: '4px',
      marginRight: '8px',
      color: '#D6B7FF',
    };

    const selectStyle = {
      display: 'inline-block',
      color: '#D6B7FF',
    };

    const weekStyle = {
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      marginTop: '10px',
      color: '#D6B7FF',
    };
    const dotSelected = {
      backgroundColor: '#D6B7FF',
      color: '#ffffff',
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
                  style={{
                    cursor: 'pointer',
                    padding: '1rem',
                    backgroundColor: '#D6B7FF',
                    color: '#ffffff',
                  }}
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
                  style={{
                    cursor: 'pointer',
                    padding: '1rem',
                    backgroundColor: '#ffffff',
                    color: '#D6B7FF',
                  }}
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
            <h5 className="normalfancytext">Repeating Options</h5>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '5px',
                color: '#D6B7FF',
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
                  style={{ color: '#D6B7FF' }}
                  onSelect={(eventKey) => handleRepeatDropDown(eventKey)}
                >
                  day
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="WEEK"
                  style={{ color: '#D6B7FF' }}
                  onSelect={(eventKey) =>
                    handleRepeatDropDown(eventKey, week_days)
                  }
                >
                  week
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="MONTH"
                  style={{ color: '#D6B7FF' }}
                  onSelect={(eventKey) => handleRepeatDropDown(eventKey)}
                >
                  month
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="YEAR"
                  style={{ color: '#D6B7FF' }}
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
                  setRepeatRadio_temp(e.target.value);
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
                    defaultChecked={repeatRadio_temp === 'Never' && true}
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
                    defaultChecked={repeatRadio_temp === 'On' && true}
                  />
                  Until
                  <DatePicker
                    className="date-picker-btn btn btn-light"
                    selected={repeatEndDate_temp}
                    onChange={(date) => handleRepeatEndDate(date)}
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
                    defaultChecked={repeatRadio_temp === 'After' && true}
                  />
                  After
                  <span style={{ marginLeft: '60px' }}>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={repeatOccurrence_temp}
                      onChange={(e) => handleRepeatOccurrence(e.target.value)}
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
                  onClick={closeRepeatModal}
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
                  onClick={saveRepeatChanges}
                >
                  Save changes
                </button>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal.Dialog>
    );
  };

  const [fields, setFields] = useState([{ email: userEmail }]);
  function handleChange(i, event) {
    const emails = [...fields];
    emails[i].email = event.target.value;
    setFields(emails);
  }

  function handleAdd() {
    const emails = [...fields];
    emails.push({ email: userEmail });
    setFields(emails);
  }

  function handleRemove(i) {
    const emails = [...fields];
    emails.splice(i, 1);
    setFields(emails);
  }
  const submit = (e) => {
    e.preventDefault();
    console.log(repeatOptionDropDown);
    let x = '2021-11-17T01:30:00-08:00';
    console.log(moment(x).format('ddd MMM DD YYYY hh:mm:ss [GMT]ZZ(PST)'));
    editingEventContext.setEditingEvent({
      ...editingEventContext.editingEvent,
      editing: true,
    });
    let organizer = 'calendar@manifestmy.space';
    if (BASE_URL.substring(8, 18) == '3s3sftsr90') {
      console.log('base_url', BASE_URL.substring(8, 18));
      organizer = 'calendar@manifestmy.space';
      console.log(organizer);
    } else {
      console.log('base_url', BASE_URL.substring(8, 18));
      organizer = 'calendar@manifestmy.life';
      console.log(organizer);
    }

    var event = {
      summary,
      description,
      location,
      creator: {
        email: props.organizerEmail,
        self: true,
      },
      organizer: {
        email: props.organizerEmail,
        self: true,
      },
      start: {
        dateTime: moment(startTime),
        timeZone: userTime_zone,
      },
      end: {
        dateTime: moment(endTime),
        timeZone: userTime_zone,
      },
      recurrence: repeatOption ? [recurrenceRule] : false,
      attendees: fields,
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: reminderMethod == '' ? 'email' : reminderMethod,
            minutes: reminderMinutes == '' ? 0 : reminderMinutes,
          },
        ],
      },
    };
    //publishTheCalenderEvent(event);
    const createEvent = async () => {
      const headersTa = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + props.taAccessToken,
      };
      await axios
        .post(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${API_KEY}`,
          event,
          {
            headers: headersTa,
          }
        )
        .then((response) => {
          console.log(response);
          const timer = setTimeout(() => {
            fetchEvent();
          }, 2000);

          return () => clearTimeout(timer);
        })
        .catch((error) => {
          console.log('error', error);
        });
    };
    createEvent();
    const fetchEvent = async () => {
      let start =
        props.stateValue.dateContext.format('YYYY-MM-DD') + 'T00:00:00-07:00';
      let endofWeek = moment(props.stateValue.dateContext).add(6, 'days');
      let end = endofWeek.format('YYYY-MM-DD') + 'T23:59:59-07:00';
      const headersUser = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + props.userAccessToken,
      };
      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?orderBy=startTime&singleEvents=true&timeMax=${end}&timeMin=${start}&key=${API_KEY}`;
      await axios
        .get(url, {
          headers: headersUser,
        })
        .then((response) => {
          console.log('day events ', response.data.items);
          const temp = [];

          for (let i = 0; i < response.data.items.length; i++) {
            temp.push(response.data.items[i]);
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

          props.setEvents(temp);
        })
        .catch((error) => console.log(error));
    };
    editingEventContext.setEditingEvent({
      ...editingEventContext.editingEvent,
      editing: false,
    });
  };

  return (
    <div>
      {!props.signedin ? (
        <div className="google-login"></div>
      ) : (
        <div
          style={{
            marginTop: '1rem',
            marginLeft: '2rem',
            //marginRight: '3rem',
            width: '90%',
            backgroundColor: '#D6B7FF',
            color: '#ffffff',
          }}
        >
          <Container
            style={{
              paddingLeft: '1rem',
              paddingTop: '1rem',

              width: '100%',
            }}
          >
            <Col style={{ float: 'left', width: '30%' }}>
              <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                Event Name
              </div>
              <input
                style={{
                  borderRadius: '10px',
                  border: 'none',
                  width: '80%',
                  height: '2rem',
                  marginTop: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />

              <div style={{ marginTop: '40px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                  Description
                </div>
                <input
                  style={{
                    margin: '5px 0',
                    borderRadius: '10px',
                    border: 'none',
                    width: '80%',
                    height: '4rem',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                Start Time
              </div>
              <Container>
                <Row>
                  <Col
                    //sm={6}
                    style={{
                      margin: '0',
                      padding: '0',
                      // width: '30%',
                    }}
                  >
                    {startTimePicker()}
                  </Col>
                </Row>
              </Container>

              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  marginTop: '10px',
                }}
              >
                End Time
              </div>
              <Container>
                <Row>
                  <Col
                    //sm={7}
                    style={{
                      margin: '0',
                      padding: '0',
                      // width: '30%',
                    }}
                  >
                    {endTimePicker()}
                  </Col>
                </Row>
              </Container>
            </Col>

            <div
              style={{
                float: 'left',
                backgroundColor: 'white',
                width: '2px',
                height: '500px',
                marginLeft: '1%',
                marginRight: '1%',
              }}
            />

            <Col style={{ float: 'left', width: '30%' }}>
              <Row style={{ fontWeight: 'bold', fontSize: '20px' }}>
                Repeating Options
              </Row>

              <Row
                style={{
                  padding: '10px 0 0 0',
                }}
              >
                <Col style={{ margin: '10px 0' }}>
                  <Row
                    style={{ marginBottom: '20px', verticalAlign: 'middle' }}
                  >
                    <DropdownButton
                      className="repeatOptionDropDown"
                      // onClick={this.openRepeatModal}
                      title={
                        repeatOptionDropDown === 'Does not repeat'
                          ? 'Does not repeat'
                          : 'Custom...'
                      }
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
                            setRecurrenceRule();
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
                    <div>{showRepeatModal && repeatModal()}</div>
                  </Row>
                  <Row>{repeatOptionDropDown}</Row>
                </Col>
              </Row>
              <Row style={{ fontWeight: 'bold', fontSize: '20px' }}>
                Notifications
              </Row>
              <Row>
                <Col>
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
                        setReminderMethod(e.target.value);
                      }
                    }}
                  >
                    Ends
                    <Form.Check type="radio">
                      <Form.Check.Label style={{ marginLeft: '5px' }}>
                        <Form.Check.Input
                          type="radio"
                          name="radios"
                          value="email"
                          style={{ marginTop: '10px' }}
                          defaultChecked={reminderMethod === 'email' && true}
                        />
                        Email
                        <span style={{ marginLeft: '60px' }}>
                          <input
                            type="number"
                            min="1"
                            max="10000"
                            value={reminderMinutes}
                            onChange={(e) =>
                              handleReminderMinutes(e.target.value)
                            }
                            className="input-exception"
                          />
                        </span>
                      </Form.Check.Label>
                    </Form.Check>
                    <Form.Check type="radio">
                      <Form.Check.Label style={{ marginLeft: '5px' }}>
                        <Form.Check.Input
                          type="radio"
                          name="radios"
                          value="popup"
                          style={{ marginTop: '12px' }}
                          defaultChecked={reminderMethod === 'popup' && true}
                        />
                        PopUp
                        <span style={{ marginLeft: '50px' }}>
                          <input
                            type="number"
                            min="1"
                            max="10000"
                            value={reminderMinutes}
                            onChange={(e) =>
                              handleReminderMinutes(e.target.value)
                            }
                            className="input-exception"
                          />
                        </span>
                      </Form.Check.Label>
                    </Form.Check>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <div
              style={{
                float: 'left',
                backgroundColor: 'white',
                width: '2px',
                height: '500px',
                marginLeft: '1%',
                marginRight: '1%',
              }}
            />

            <Col style={{ float: 'left', width: '30%' }}>
              <Row style={{ fontWeight: 'bold', fontSize: '20px' }}>
                Location
              </Row>

              <Row
                style={{
                  padding: '10px 0 0 0',
                }}
              >
                <Col style={{ margin: '10px 0' }}>
                  <Row
                    style={{ marginBottom: '20px', verticalAlign: 'middle' }}
                  >
                    <input
                      style={{
                        margin: '5px 0',
                        borderRadius: '10px',
                        border: 'none',
                        width: '100%',
                        height: '2rem',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </Row>
                </Col>
              </Row>
              <Row style={{ fontWeight: 'bold', fontSize: '20px' }}>
                Attendees
              </Row>
              <Row
                style={{
                  padding: '10px 0 0 0',
                }}
              >
                <Col style={{ margin: '10px 0' }}>
                  <Row
                    style={{ marginBottom: '20px', verticalAlign: 'middle' }}
                  >
                    {fields.map((field, idx) => {
                      return (
                        <Row>
                          <Col>
                            <input
                              style={{
                                margin: '5px 0',
                                borderRadius: '10px',
                                border: 'none',
                                width: '100%',
                                height: '2rem',
                                fontSize: '12px',
                                fontWeight: 'bold',
                              }}
                              type="text"
                              placeholder={userEmail}
                              onChange={(e) => handleChange(idx, e)}
                            />
                          </Col>
                          <Col xs={1}>
                            <div
                              style={{
                                width: '21px',
                                height: '21px',
                                margin: '5px 0',
                                backgroundImage: `url(${trash})`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                cursor: 'pointer',
                              }}
                              onClick={() => handleRemove(idx)}
                            ></div>
                          </Col>
                        </Row>
                      );
                    })}
                    <div className="eventItem">
                      <div
                        style={{
                          width: '100%',
                          padding: '0',
                          margin: '20px 40px',
                          backgroundColor: 'inherit',
                          border: '2px white solid',
                          borderRadius: '30px',
                          color: '#ffffff',
                          textAlign: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleAdd()}
                      >
                        + Add Person
                      </div>
                    </div>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Container>
          <div
            style={{
              textAlign: 'center',
              marginTop: '20px',
              paddingBottom: '20px',
            }}
          >
            <button
              style={{
                width: '150px',
                padding: '0',
                margin: '0 20px',
                backgroundColor: 'inherit',
                border: '3px white solid',
                borderRadius: '30px',
                color: '#ffffff',
                textAlign: 'center',
              }}
              onClick={() => {
                editingEventContext.setEditingEvent({
                  ...editingEventContext.editingEvent,
                  editing: false,
                });
              }}
            >
              Cancel
            </button>
            <button
              style={{
                width: '150px',
                padding: '0',
                margin: '0 20px',
                backgroundColor: 'inherit',
                border: '3px white solid',
                borderRadius: '30px',
                color: '#ffffff',
                textAlign: 'center',
              }}
              onClick={(e) => {
                submit(e);
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
