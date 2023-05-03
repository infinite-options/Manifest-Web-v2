import React, { useState, useEffect } from "react";
import axios from 'axios';
import { CSVLink, CSVDownload } from 'react-csv';
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

export default function Download(props) {
  const [dataInCSV, setDataInCSV] = useState("");
  const [data, setData] = useState([])
  const [userID, setUserUD] = useState(document.cookie
    .split('; ')
    .find((row) => row.startsWith('patient_uid='))
    .split('=')[1])
  const [taID, setTaID] = useState(document.cookie
    .split('; ')
    .find((row) => row.startsWith('ta_uid='))
    .split('=')[1])
  const [goalsOrRoutinesList, setGoalsOrRoutinesList] = useState({ ...props.list });
  const [grFileName, setGRFileName] = useState("Goals-Routines");
  const [showDownloadAck, setShowDownloadAck] = useState(false);

  useEffect(() => {
    setGoalsOrRoutinesList(props.list);
  }, [props.list]);
  console.log("txt got goalsOrRoutinesList in downloadCSV", goalsOrRoutinesList);

  const headers = [
    { label: 'gr_unique_id', key: 'gr_unique_id' },
    { label: 'gr_title', key: 'gr_title' },
    { label: 'user_id', key: 'user_id' },
    // { label: 'gr_completed', key: 'gr_completed' },
    { label: 'gr_start_day_and_time', key: 'gr_start_day_and_time' },
    { label: 'gr_end_day_and_time', key: 'gr_end_day_and_time' },
    { label: 'gr_expected_completion_time', key: 'gr_expected_completion_time' },
    { label: 'repeat', key: 'repeat' },
    { label: 'repeat_type', key: 'repeat_type' },
    { label: 'repeat_ends_on', key: 'repeat_ends_on' },
    { label: 'repeat_every', key: 'repeat_every' },
    { label: 'repeat_frequency', key: 'repeat_frequency' },
    { label: 'repeat_occurences', key: 'repeat_occurences' },
    { label: 'is_available', key: 'is_available' },
    { label: 'is_complete', key: 'is_complete' },
    { label: 'is_displayed_today', key: 'is_displayed_today' },
    { label: 'is_in_progress', key: 'is_in_progress' },
    { label: 'is_persistent', key: 'is_persistent' },
    { label: 'is_sublist_available', key: 'is_sublist_available' },
    { label: 'is_timed', key: 'is_timed' },
    { label: 'gr_photo', key: 'gr_photo' },
    // { label: 'notifications', key: 'notifications' },
    { label: 'gr_datetime_started', key: 'gr_datetime_started' },
    { label: 'gr_datetime_completed', key: 'gr_datetime_completed' },
    // { label: 'repeat_week_days', key: 'repeat_week_days' },
    { label: 'status', key: 'status' },

    { label: 'user_before_is_enable', key: 'user_before_is_enable'},
    { label: 'user_before_is_set', key: 'user_before_is_set' },
    { label: 'user_before_message', key: 'user_before_message'},
    { label: 'user_before_time', key: 'user_before_time' },

    { label: 'user_during_is_enable', key: 'user_during_is_enable'},
    { label: 'user_during_is_set', key: 'user_during_is_set' },
    { label: 'user_during_message', key: 'user_during_message'},
    { label: 'user_during_time', key: 'user_during_time' },

    { label: 'user_after_is_enable', key: 'user_after_is_enable'},
    { label: 'user_after_is_set', key: 'user_after_is_set' },
    { label: 'user_after_message', key: 'user_after_message'},
    { label: 'user_after_time', key: 'user_after_time' },

    { label: 'ta_before_is_enable', key: 'ta_before_is_enable'},
    { label: 'ta_before_is_set', key: 'ta_before_is_set' },
    { label: 'ta_before_message', key: 'ta_before_message'},
    { label: 'ta_before_time', key: 'ta_before_time' },

    { label: 'ta_during_is_enable', key: 'ta_during_is_enable'},
    { label: 'ta_during_is_set', key: 'ta_during_is_set' },
    { label: 'ta_during_message', key: 'ta_during_message'},
    { label: 'ta_during_time', key: 'ta_during_time' },

    { label: 'ta_after_is_enable', key: 'ta_after_is_enable'},
    { label: 'ta_after_is_set', key: 'ta_after_is_set' },
    { label: 'ta_after_message', key: 'ta_after_message'},
    { label: 'ta_after_time', key: 'ta_after_time' },
    
];
  useEffect(() => {
    if (goalsOrRoutinesList && goalsOrRoutinesList.length>=0) {
      let data1 = [];
      goalsOrRoutinesList.map(item => {

        var ta_notifications = {
          before: {
            is_enabled: false,
            is_set: false,
            message: '',
            time: '',
          },
          during: {
            is_enabled: false,
            is_set: false,
            message: '',
            time: '',
          },
          after: {
            is_enabled: false,
            is_set: false,
            message: '',
            time: '',
          },
        };
        var user_notifications = {
          before: {
            is_enabled: false,
            is_set: false,
            message: '',
            time: 0,
          },
          during: {
            is_enabled: false,
            is_set: false,
            message: '',
            time: 0,
          },
          after: {
            is_enabled: false,
            is_set: false,
            message: '',
            time: 0,
          },
        }

        var taNotification = item.notifications.find(notification => notification.user_ta_id === taID);
        if (taNotification && taNotification.length !== 0) {
          ta_notifications.before.is_enabled = taNotification.before_is_enable;
          ta_notifications.before.is_set = taNotification.before_is_set;
          ta_notifications.before.message = taNotification.before_message;
          ta_notifications.before.time = taNotification.before_time;

          ta_notifications.during.is_enabled = taNotification.during_is_enable;
          ta_notifications.during.is_set = taNotification.during_is_set;
          ta_notifications.during.message = taNotification.during_message;
          ta_notifications.during.time = taNotification.during_time;

          ta_notifications.after.is_enabled = taNotification.after_is_enable;
          ta_notifications.after.is_set = taNotification.after_is_set;
          ta_notifications.after.message = taNotification.after_message;
          ta_notifications.after.time = taNotification.after_time;
        }

        var userNotification = item.notifications.find(notification => notification.user_ta_id === userID);
        if (userNotification && userNotification.length !== 0) {
          user_notifications.before.is_enabled = userNotification.before_is_enable;
          user_notifications.before.is_set = userNotification.before_is_set;
          user_notifications.before.message = userNotification.before_message;
          user_notifications.before.time = userNotification.before_time;

          user_notifications.during.is_enabled = userNotification.during_is_enable;
          user_notifications.during.is_set = userNotification.during_is_set;
          user_notifications.during.message = userNotification.during_message;
          user_notifications.during.time = userNotification.during_time;

          user_notifications.after.is_enabled = userNotification.after_is_enable;
          user_notifications.after.is_set = userNotification.after_is_set;
          user_notifications.after.message = userNotification.after_message;
          user_notifications.after.time = userNotification.after_time;
        }

        console.log("txt here: Obtained user information with res = ", userNotification)
        data1.push({
          gr_unique_id: item.gr_unique_id,
          gr_title: item.gr_title,
          user_id: item.user_id,
                    
          // gr_completed: item.gr_completed === null ? 'null' : item.gr_completed,
          gr_datetime_completed: item.gr_datetime_completed.toString(),
          gr_datetime_started: item.gr_datetime_started.toString(),
          gr_end_day_and_time: item.gr_end_day_and_time.toString(),
          gr_expected_completion_time: item.gr_expected_completion_time.toString(),
          gr_photo: item.gr_photo,
          gr_start_day_and_time: item.gr_start_day_and_time.toString(),
          is_available: item.is_available,
          is_complete: item.is_complete,
          is_displayed_today: item.is_displayed_today,
          is_in_progress: item.is_in_progress,
          is_persistent: item.is_persistent,
          is_sublist_available: item.is_sublist_available,
          is_timed: item.is_timed,
          // notifications: { ...result.notification_id },
          repeat: item.repeat,
          repeat_ends_on: item.repeat_ends_on,
          repeat_every: item.repeat_every,
          repeat_frequency: item.repeat_frequency,
          repeat_occurences: item.repeat_occurences,
          repeat_type: item.repeat_type,
          status: item.status,

          user_before_is_enable : user_notifications.before.is_enabled,
          user_before_is_set : user_notifications.before.is_set,
          user_before_message : user_notifications.before.message,
          user_before_time : user_notifications.before.time,

          user_during_is_enable : user_notifications.during.is_enabled,
          user_during_is_set : user_notifications.during.is_set,
          user_during_message : user_notifications.during.message,
          user_during_time : user_notifications.during.time,

          user_after_is_enable : user_notifications.after.is_enabled,
          user_after_is_set : user_notifications.after.is_set,
          user_after_message : user_notifications.after.message,
          user_after_time: user_notifications.after.time,
          
          ta_before_is_enable : ta_notifications.before.is_enabled,
          ta_before_is_set : ta_notifications.before.is_set,
          ta_before_message : ta_notifications.before.message,
          ta_before_time : ta_notifications.before.time,

          ta_during_is_enable : ta_notifications.during.is_enabled,
          ta_during_is_set : ta_notifications.during.is_set,
          ta_during_message : ta_notifications.during.message,
          ta_during_time : ta_notifications.during.time,

          ta_after_is_enable : ta_notifications.after.is_enabled,
          ta_after_is_set : ta_notifications.after.is_set,
          ta_after_message : ta_notifications.after.message,
          ta_after_time : ta_notifications.after.time,
          // repeat_week_days: item.repeat_week_days.replaceAll(',','\t'),
        })
      })
      setData(data1)
      console.log("here: Obtained user information with data = ", data1)
    }
  }, [goalsOrRoutinesList]);
  
  function createCSVFileName() {
    var fname = userID+'Routines';
    // setGRFileName(fname);
    return fname;
  }
  return (
    <div>
        {data && (
          <>
            <CSVLink
                data={data}
                headers={headers}
                filename={createCSVFileName()}
                target="_blank"
                style={{ textDecoration: 'none', outline: 'none', height: '5vh' }}
          >
            <div>
                <button onClick={()=>setShowDownloadAck(true)}>
                    Download CSV
                </button>
                {/* <Modal
                  show={showDownloadAck}
                  onHide={()=>setShowDownloadAck(false)}
                  > */}
              {/* </Modal> */}
            </div>
          </CSVLink>
          <br></br>
          {showDownloadAck && <p> File downloaded successfully </p>}
          </>
      )}
      
    </div>
  );
}
