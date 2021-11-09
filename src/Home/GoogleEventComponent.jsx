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
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

export default function GoogleEventComponent(props) {
  //const classes = useStyles();
  console.log("in add events", props)
  const loginContext = useContext(LoginContext);

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
  console.log('in add events', userEmail)
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
  
  
  useEffect(() => {
    initClient((success) => {
      if (success) {
        getGoogleAuthorizedEmail();
      }
    });
  }, []);

  const startTimePicker = () => {
    // const [startDate, setStartDate] = useState(new Date());
    return (
      <DatePicker
        className="form-control"
        type="text"
        selected={startTime}
        onChange={(date) => {
          // this.setState(
          //   {
          //     newEventStart0: date,
          //   },
          //   () => {
          //     console.log('starttimepicker', this.state.newEventStart0);
          //   }
          // );
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
    // const [startDate, setStartDate] = useState(new Date());
    return (
      <DatePicker
        className="form-control"
        type="text"
        style={{ width: '100%' }}
        selected={endTime}
        onChange={(date) => {
          // this.setState(
          //   {
          //     newEventEnd0: date,
          //   },
          //   () => {
          //     console.log(this.state.newEventEnd0);
          //   }
          // );
          setEndTime(date)
        }}
        showTimeSelect
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
      />
    );
  };

  // const getGoogleAuthorizedEmail = async () => {
  //   let email = userEmail
  //   console.log('in add events', email);
  //   if (email) {
  //     setSignedIn(true);
  //     setgoogleAuthedEmail(email);
  //   }
  // };
  // const getAuthToGoogle = async () => {
  //   // let successfull = await signInToGoogle();
  //   // if (successfull) {
  //     getGoogleAuthorizedEmail();
  //   //}
  // };

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
      attendees:[
        {email : attendees}
      ],

    };
    publishTheCalenderEvent(event);
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
