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
    { label: 'gr_photo', key: 'gr_photo' },
    // { label: 'notifications', key: 'notifications' },
    { label: 'gr_datetime_completed', key: 'gr_datetime_completed' },
    { label: 'gr_datetime_started', key: 'gr_datetime_started' },
    { label: 'gr_end_day_and_time', key: 'gr_end_day_and_time' },
    { label: 'gr_expected_completion_time', key: 'gr_expected_completion_time' },
    { label: 'gr_start_day_and_time', key: 'gr_start_day_and_time' },
    { label: 'is_available', key: 'is_available' },
    { label: 'is_complete', key: 'is_complete' },
    { label: 'is_displayed_today', key: 'is_displayed_today' },
    { label: 'is_in_progress', key: 'is_in_progress' },
    { label: 'is_persistent', key: 'is_persistent' },
    { label: 'is_sublist_available', key: 'is_sublist_available' },
    { label: 'is_timed', key: 'is_timed' },
    { label: 'repeat', key: 'repeat' },
    { label: 'repeat_ends_on', key: 'repeat_ends_on' },
    { label: 'repeat_every', key: 'repeat_every' },
    { label: 'repeat_frequency', key: 'repeat_frequency' },
    { label: 'repeat_occurences', key: 'repeat_occurences' },
    { label: 'repeat_type', key: 'repeat_type' },
    // { label: 'repeat_week_days', key: 'repeat_week_days' },
    { label: 'status', key: 'status' },
    
];
  useEffect(() => {
    // let userID = '100-000286';
    // axios
    //   .get(BASE_URL + 'getroutines/' + userID)
    //     .then((response) => {
    //         console.log(
    //             'here: Obtained user information with res = ',
    //             response.data.result.keys
    //         );
    //         console.log("here: Obtained user information with res = ", typeof (dataInCSV));
    if (goalsOrRoutinesList && goalsOrRoutinesList.length>=0) {
      let data1 = [];
      goalsOrRoutinesList.map(item => {
        console.log("here: Obtained user information with res = ", item)
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
          // notifications: {
          //   ...item.notifications[0],
          // },
          repeat: item.repeat,
          repeat_ends_on: item.repeat_ends_on,
          repeat_every: item.repeat_every,
          repeat_frequency: item.repeat_frequency,
          repeat_occurences: item.repeat_occurences,
          repeat_type: item.repeat_type,
          status: item.status
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
