let gapi = window.gapi;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
];
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;
let CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE;
let CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_SPACE;

const SCOPES = 'https://www.googleapis.com/auth/calendar.events email';

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
}
// else {
//   userID = loginContext.loginState.curUser;
//   userTime_zone = loginContext.loginState.curUserTimeZone;
//   userEmail = loginContext.loginState.curUserEmail;
// }
console.log('in add events', userEmail);
console.log('in add events', document.cookie);
console.log('in add events', userID);

export function initClient(callback) {
  if (BASE_URL.substring(8, 18) == 'gyn3vgy3fb') {
    console.log('base_url', BASE_URL.substring(8, 18));
    CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_SPACE;
    CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_SPACE;
    console.log(CLIENT_ID, CLIENT_SECRET);
  } else {
    console.log('base_url', BASE_URL.substring(8, 18));
    CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID_LIFE;
    CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET_LIFE;
    console.log(CLIENT_ID, CLIENT_SECRET);
  }
  gapi.load('client:auth2', () => {
    try {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(
          function () {
            if (typeof callback === 'function') {
              callback(true);
            }
          },
          function (error) {
            console.log(error);
          }
        );
    } catch (error) {
      console.log(error);
    }
  });
}

export const checkSignInStatus = async () => {
  try {
    let status = await gapi.auth2.getAuthInstance().isSignedIn.get();
    return status;
  } catch (error) {
    console.log(error);
  }
};

export const signInToGoogle = async (email) => {
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
  console.log('signintogoogle', email);
  try {
    let googleuser = await gapi.auth2
      .getAuthInstance()
      .signIn({ prompt: 'none', login_hint: email });
    if (googleuser) {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};
export const getSignedInUserEmail = async () => {
  try {
    let status = await checkSignInStatus();
    if (status) {
      var auth2 = gapi.auth2.getAuthInstance();
      var profile = auth2.currentUser.get().getBasicProfile();
      return profile.getEmail();
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};
export const signOutFromGoogle = () => {
  try {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      auth2.disconnect();
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};
export const publishTheCalenderEvent = (event) => {
  try {
    gapi.client.load('calendar', 'v3', () => {
      var request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      request.execute(function (event) {
        console.log('Event created: ' + event.htmlLink);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateTheCalenderEvent = (event) => {
  try {
    console.log('updatedTheCalenderEvent', event);
    gapi.client.load('calendar', 'v3', () => {
      console.log('updatedTheCalenderEvent in');
      var request = gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: event['id'],
        resource: event,
      });
      console.log('updatedTheCalenderEvent', request);
      request.execute(function (event) {
        console.log('Event updated: ' + event.htmlLink);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTheCalenderEvent = (id) => {
  try {
    console.log('deletedTheCalenderid', id);
    gapi.client.load('calendar', 'v3', () => {
      console.log('deletedTheCalenderEvent in');
      var request = gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: id,
      });
      console.log('deletedTheCalenderEvent', request);
      request.execute(function (id) {
        console.log('Event deleted ');
      });
    });
  } catch (error) {
    console.log(error);
  }
};
