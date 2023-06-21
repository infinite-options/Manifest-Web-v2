import React, { useEffect, useState, useContext } from "react";
import _ from 'lodash';
import axios from 'axios';
// import EditRTSContext from './EditRTS/EditRTSContext';
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

export default function UploadCSV(props) {
    var newGR = 0;
    var GRlist = [];
    // const editingRTSContext = useContext(EditRTSContext);
    const [file, setFile] = useState();
    // const [array, setArray] = useState([]);
    const [userID, setUserID] = useState(document.cookie
        .split('; ')
        .find((row) => row.startsWith('patient_uid='))
        .split('=')[1])
    const [taID, setTaID] = useState(document.cookie
        .split('; ')
        .find((row) => row.startsWith('ta_uid='))
        .split('=')[1])
    const [goalsOrRoutinesList, setGoalsOrRoutinesList] = useState({ ...props.list });
    useEffect(() => {
        setGoalsOrRoutinesList(props.list);
    }, [props.list]);

    console.log("txt got goalsOrRoutinesList", goalsOrRoutinesList);

    const compareLists = array => {
        // let object = { ...editingRTSContext.editingRTS.newItem };
        // console.log("txt object :", object)
        // if goalsOrRoutinesList.length == 0 && array.length>0 => bulk insert

        // both length>0
        if (goalsOrRoutinesList) {
            var list = goalsOrRoutinesList;
            array.map(gr => {
                if ("gr_unique_id" in gr && gr['gr_unique_id']) {
                    console.log("txt : gr_unique_id = ", gr['gr_unique_id']);
                    var result = list.find(lst => lst.gr_unique_id.replaceAll('"', '') === gr['gr_unique_id'].replaceAll('"', ''));
                    // console.log("txt : corresponding GR ", result, " & GR is", gr)
                    if (!result || result !== 'undefined' || result.length > 0) {
                        console.log("***this ", result)
                        // GR object from imported csv for comparison against corresponding GR in the DB
                        var obj = {
                            gr_completed: null,
                            gr_datetime_completed: gr.gr_datetime_completed,
                            gr_datetime_started: gr.gr_datetime_started,
                            gr_title: gr['gr_title'] ? gr['gr_title'] : result['gr_title'],
                            repeat: gr.repeat,
                            repeat_frequency: gr.repeat_frequency,
                            repeat_every: gr.repeat_every,
                            repeat_type: gr.repeat_type,
                            repeat_ends_on: gr.repeat_ends_on,
                            repeat_occurences: gr.repeat_occurences,
                            repeat_week_days: result['repeat_week_days'], //no update
                            is_available: gr.is_available,
                            is_persistent: gr.is_persistent,
                            is_complete: gr.is_complete,
                            is_displayed_today: gr.is_displayed_today,
                            is_timed: gr.is_timed,
                            is_sublist_available: result['is_sublist_available'],
                            gr_photo: result['gr_photo'],
                            user_id: gr.user_id,
                            is_in_progress: gr.is_in_progress,
                            status: gr.status,
                            gr_start_day_and_time: gr.gr_start_day_and_time,
                            gr_end_day_and_time: gr.gr_end_day_and_time,
                            gr_expected_completion_time: gr.gr_expected_completion_time,
                            gr_unique_id: gr['gr_unique_id'],
                        }

                        console.log("txt in existing GR", result);
                        console.log("txt in imported CSV", obj);

                        // compare each GR from the imported csv against corresponding GR in the database and update DB if there is a change
                        var isEqual = _.isMatch(result, obj);
                        console.log("txt isEqual - ", obj['gr_unique_id'], isEqual);

                        // compare TA notifications from imported csv against existing notification list
                        var ta_notifications = { "before": { "is_enabled": gr.ta_before_is_enable, "is_set": gr.ta_before_is_set, "message": gr.ta_before_message, "time": gr.ta_before_time }, "during": { "is_enabled": gr.ta_during_is_enable, "is_set": gr.ta_during_is_set, "message": gr.ta_during_message, "time": gr.ta_during_time }, "after": { "is_enabled": gr.ta_after_is_enable, "is_set": gr.ta_after_is_set, "message": gr.ta_after_message, "time": gr.ta_after_time } };
                        var taNotification = result.notifications.find(notification => notification.user_ta_id === taID);
                        if (taNotification && taNotification.length !== 0) {
                            var isTANotificationEqual;
                            if (taNotification.before_is_enable === gr.ta_before_is_enable &&
                                taNotification.before_is_set === gr.ta_before_is_set &&
                                taNotification.before_message === gr.ta_before_message &&
                                taNotification.before_time === gr.ta_before_time &&

                                taNotification.during_is_enable === gr.ta_during_is_enable &&
                                taNotification.during_is_set === gr.ta_during_is_set &&
                                taNotification.during_message === gr.ta_during_message &&
                                taNotification.during_time === gr.ta_during_time &&

                                taNotification.after_is_enable === gr.ta_after_is_enable &&
                                taNotification.after_is_set === gr.ta_after_is_set &&
                                taNotification.after_message === gr.ta_after_message &&
                                taNotification.after_time === gr.ta_after_time
                            ) {
                                isTANotificationEqual = true;
                                console.log("txt ta notifications equal");
                            }
                        }
                        else {
                            isTANotificationEqual = false;
                        }
                        console.log("txt isTANotificationEqual - ", obj['gr_unique_id'], isTANotificationEqual);

                        // compare user notifications from imported csv against existing notification list
                        var user_notifications = { "before": { "is_enabled": gr.user_before_is_enable, "is_set": gr.user_before_is_set, "message": gr.user_before_message, "time": gr.user_before_time }, "during": { "is_enabled": gr.user_during_is_enable, "is_set": gr.user_during_is_set, "message": gr.user_during_message, "time": gr.user_during_time }, "after": { "is_enabled": gr.user_after_is_enable, "is_set": gr.user_after_is_set, "message": gr.user_after_message, "time": gr.user_after_time } };
                        var userNotification = result.notifications.find(notification => notification.user_ta_id === userID);
                        console.log("txt user notifications db : ", userNotification, "\n user txt notifications csv :", user_notifications)
                        if (userNotification && userNotification.length !== 0) {
                            var isUserNotificationEqual;
                            if (userNotification.before_is_enable === gr.user_before_is_enable &&
                                userNotification.before_is_set === gr.user_before_is_set &&
                                userNotification.before_message === gr.user_before_message &&
                                userNotification.before_time === gr.user_before_time &&

                                userNotification.during_is_enable === gr.user_during_is_enable &&
                                userNotification.during_is_set === gr.user_during_is_set &&
                                userNotification.during_message === gr.user_during_message &&
                                userNotification.during_time === gr.user_during_time &&

                                userNotification.after_is_enable === gr.user_after_is_enable &&
                                userNotification.after_is_set === gr.user_after_is_set &&
                                userNotification.after_message === gr.user_after_message &&
                                userNotification.after_time === gr.user_after_time
                            ) {
                                isUserNotificationEqual = true;
                                console.log("txt user notifications equal");
                            }
                        }
                        else {
                            isUserNotificationEqual = false;
                        }
                        console.log("txt isUserNotificationEqual - ", obj['gr_unique_id'], isUserNotificationEqual);

                        if (isEqual === true && isTANotificationEqual === true && isUserNotificationEqual === true) {
                            console.log("txt : ", obj['gr_unique_id'], " - no update required");
                        }
                        else {
                            // payload for updateGR API call
                            var updateGRObj = {
                                audio: '',
                                datetime_completed: obj.gr_datetime_completed,
                                datetime_started: obj.gr_datetime_started,
                                title: obj.gr_title,
                                repeat: obj.repeat,
                                repeat_frequency: obj.repeat_frequency,
                                repeat_every: obj.repeat_every,
                                repeat_type: obj.repeat_type,
                                repeat_ends_on: obj.repeat_ends_on,
                                repeat_occurences: obj.repeat_occurences,
                                repeat_week_days: obj.repeat_week_days, //no update
                                is_available: obj.is_available,
                                is_persistent: obj.is_persistent,
                                is_complete: obj.is_complete,
                                is_displayed_today: obj.is_displayed_today,
                                is_timed: obj.is_timed,
                                is_sublist_available: obj.is_sublist_available,
                                photo_url: obj.gr_photo,
                                ta_notifications: ta_notifications,
                                user_notifications: user_notifications,
                                user_id: obj.user_id,
                                is_in_progress: obj.is_in_progress,
                                status: obj.status,
                                start_day_and_time: obj.gr_start_day_and_time,
                                end_day_and_time: obj.gr_end_day_and_time,
                                expected_completion_time: obj.gr_expected_completion_time,
                                gr_unique_id: obj.gr_unique_id,
                                ta_people_id: taID,
                            }
                            let formData = new FormData();
                            Object.entries(updateGRObj).forEach((entry) => {
                                console.log('test-entry: ', entry);
                                if (typeof entry[1] == 'string') {
                                    formData.append(entry[0], entry[1]);
                                } else if (entry[1] instanceof Object) {
                                    entry[1] = JSON.stringify(entry[1]);
                                    formData.append(entry[0], entry[1]);
                                } else {
                                    formData.append(entry[0], entry[1]);
                                }
                            });
                            axios
                                .post(BASE_URL + 'updateGR', formData)
                                .then((_) => {
                                    console.log("txt : ", gr['gr_unique_id'], " - updated");
                                    props.getUploadAck(updateGRObj);
                                })
                                .catch((err) => {
                                    if (err.response) {
                                        console.log(err.response);
                                    }
                                    console.log(err);
                                });
                        }
                    }
                    else {
                        // add this goal/routine in db
                        console.log("txt : no corresponding GR found")
                        if ('gr_title' in gr && gr['gr_title']) {
                            // var insert_status = addNewGR(gr);
                            createNewGRList(gr)
                            newGR++;
                            // console.log("txt : no corresponding GR found for ", gr['gr_title'] ," - creating new gr row - ", insert_status);
                        }
                    }
                }
                else {
                    // no gr_unique_id given, create one
                    console.log("txt : new row with no GR ID")
                    if ('gr_title' in gr && gr['gr_title']) {
                        // var insert_status = addNewGR(gr);
                        createNewGRList(gr)
                        newGR++;
                        // console.log("txt : creating new gr row", gr['gr_title'], " - ",insert_status)
                    }
                }
            })
            // newGRcount(newGR)
            console.log(" Total new GRs received = ", newGR);
            console.log(" GRlist ", GRlist);
            let body = { newGRCount: newGR };
            console.log(" body ", body)
            axios
                .post(BASE_URL + 'createGR_IDs', body)
                .then((response) => {
                    console.log("txt response : ", response)
                    let id_list = response.data.result.data;
                    console.log("txt id_list : ", id_list)
                    if (id_list.length === GRlist.length) {
                        console.log("successfuly created new GR IDs and notification IDs for each new GR in the uploaded file")
                        for (let idx in GRlist) {
                            let addGRobj = GRlist[idx]
                            addGRobj['gr_unique_id'] = id_list[idx]['gr_id']
                            addGRobj['ta_notfication_id'] = id_list[idx]['ta_notfication_id']
                            addGRobj['user_notfication_id'] = id_list[idx]['user_notification_id']
                            console.log(" addGRobj ", addGRobj)
                            let formData = new FormData();
                            Object.entries(addGRobj).forEach((entry) => {
                                console.log('test-entry: ', entry);
                                if (typeof entry[1] == 'string') {
                                    formData.append(entry[0], entry[1]);
                                } else if (entry[1] instanceof Object) {
                                    entry[1] = JSON.stringify(entry[1]);
                                    formData.append(entry[0], entry[1]);
                                } else {
                                    formData.append(entry[0], entry[1]);
                                }
                            });
                            console.log(" formData ", formData)
                            var res = axios
                                .post(BASE_URL + 'uploadGR', formData)
                                .then((_) => {
                                    // insert_status = "insert successful";
                                    console.log("txt $$$$$$", addGRobj['gr_unique_id'], " - inserted");
                                    console.log("txt $$$$$$ : props")
                                    props.getUploadAck(addGRobj);
                                })
                                .catch((err) => {
                                    if (err.response) {
                                        console.log(err.response);
                                    }
                                    // insert_status = "insert failed";
                                    console.log(err);
                                });
                            console.log("Add GR result = ", res);
                        }
                    }
                    else {
                        console.log("failed to create new GR IDs and notification IDs for all new GRs in the uploaded file. Try Upload again")
                    }
                })
                .catch((err) => {
                    if (err.response) {
                        console.log(err.response);
                    }
                    console.log(err);
                });
        }
        return "successful";
    }

    // function newGRcount(newGR) {
    //     console.log(" Total new GRs received = ", newGR);
    // }
    function validateDateTime(dt) {
        console.log("&&** ", dt , " = date")
        var date = new Date(Date.parse(dt));
        console.log("txt date : ", dt, " - ", date);
        if (date.toString() === "Invalid Date") {
            console.log("txt date : ", dt, " -returning ", "")
            return "";
        }
        else {
            console.log("txt date : ",dt, " -returning ",dt)
            return dt;
        }
    }

    function validateStartEndDates(startdt, enddt) {
        var start = new Date(Date.parse(startdt));
        var end = new Date(Date.parse(enddt));
        if (start > end) return false;
        else return true;
    }

    function validateDuration(time) {
        var re = new RegExp("^\d+:\d{2}:\d{2}$");
        if (re.test(time)) {
            console.log("Valid duration", time);
            return true;
        } else {
            console.log("Invalid duration", time);
            return false;
        }
    }

    const validateGR = array => {

        var errorAlerts = [];
        errorAlerts.push("Fields to fix - ")
        array.map(gr => {
            if ("gr_title" in gr && gr['gr_title']) { //gr_title is a mandatory field
                gr['gr_datetime_completed'] = validateDateTime(gr['gr_datetime_completed']);
                gr['gr_datetime_started'] = validateDateTime(gr['gr_datetime_started']);
                gr['repeat'] = gr['repeat'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['repeat_frequency'] = "Day";
                var repeat_every = isNaN(gr['repeat_every']) ? 1 : gr['repeat_every'];
                gr['repeat_every'] = parseInt(repeat_every);
                gr['repeat_type'] = (gr['repeat_type'] === 'Never' || gr['repeat_type'] === 'On' || gr['repeat_type'] === 'Occur') ? gr['repeat_type'] : 'Never';
                gr['repeat_ends_on'] = validateDateTime(gr['repeat_ends_on']);
                var repeat_occurences = isNaN(gr['repeat_occurences']) ? 0 : gr['repeat_occurences'];
                gr['repeat_occurences'] = parseInt(repeat_occurences);
                gr['is_available'] = gr['is_available'].toLowerCase() === 'false' ? 'False' : 'True';
                gr['is_persistent'] = gr['is_persistent'].toLowerCase() === 'false' ? 'False' : 'True';
                gr['is_complete'] = gr['is_complete'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['is_displayed_today'] = gr['is_displayed_today'].toLowerCase() === 'false' ? 'False' : 'True';
                gr['is_timed'] = 'False';

                // gr['is_sublist_available'] = false; because we dont want this field while comparing imported GR with existing GR
                gr['user_id'] = userID;
                gr['is_in_progress'] = gr['is_in_progress'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['status'] = (gr['status'] === "not started" || gr['status'] === "in progress" || gr['status'] === "completed") ? gr['status'] : "not started";
                gr['gr_expected_completion_time'] = gr['gr_expected_completion_time'] && validateDuration(gr['gr_expected_completion_time']) ? gr['gr_expected_completion_time'] : "00:00:00";

                // user notifications
                gr['user_before_is_enable'] = gr['user_before_is_enable'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['user_before_is_set'] = gr['user_before_is_set'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['user_before_message'] = gr['user_before_message'];
                gr['user_before_time'] = gr['user_before_time'] && validateDuration(gr['user_before_time']) ? gr['user_before_time'] : "00:00:00";

                gr['user_during_is_enable'] = gr['user_during_is_enable'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['user_during_is_set'] = gr['user_during_is_set'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['user_during_message'] = gr['user_during_message'];
                gr['user_during_time'] = gr['user_during_time'] && validateDuration(gr['user_during_time']) ? gr['user_during_time'] : "00:00:00";

                gr['user_after_is_enable'] = gr['user_after_is_enable'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['user_after_is_set'] = gr['user_after_is_set'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['user_after_message'] = gr['user_after_message'];
                gr['user_after_time'] = gr['user_after_time'] && validateDuration(gr['user_after_time']) ? gr['user_after_time'] : "00:00:00";

                // ta notifications
                gr['ta_before_is_enable'] = gr['ta_before_is_enable'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['ta_before_is_set'] = gr['ta_before_is_set'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['ta_before_message'] = gr['ta_before_message'];
                gr['ta_before_time'] = gr['ta_before_time'] && validateDuration(gr['ta_before_time']) ? gr['ta_before_time'] : "00:00:00";

                gr['ta_during_is_enable'] = gr['ta_during_is_enable'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['ta_during_is_set'] = gr['ta_during_is_set'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['ta_during_message'] = gr['ta_during_message'];
                gr['ta_during_time'] = gr['ta_during_time'] && validateDuration(gr['ta_during_time']) ? gr['ta_during_time'] : "00:00:00";

                gr['ta_after_is_enable'] = gr['ta_after_is_enable'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['ta_after_is_set'] = gr['ta_after_is_set'].toLowerCase() === 'true' ? 'True' : 'False';
                gr['ta_after_message'] = gr['ta_after_message'];
                gr['ta_after_time'] = gr['ta_after_time'] && validateDuration(gr['ta_after_time']) ? gr['ta_after_time'] : "00:00:00";

                if (validateDateTime(gr['gr_start_day_and_time']) === "" || validateDateTime(gr['gr_end_day_and_time']) === "") {
                    console.log("Incorrect Dates");
                    errorAlerts.push(gr['gr_title'] + ' : Please follow "yyyy-mm-dd hh:mm:ss AM/PM" format for gr_start_day_and_time and gr_end_day_and_time');
                }
                else if (validateStartEndDates(gr['gr_start_day_and_time'],gr['gr_end_day_and_time'])===false) {
                    console.log("Start date cannot be after end date");
                    errorAlerts.push(gr['gr_title'] + ' : Start date cannot be after end date');
                }
                // if (validateStartEndDates(gr['gr_start_day_and_time'], new Date())===false) {
                //     gr['is_displayed_today'] = 'True';
                // }
                if (gr.repeat === "True" && !(gr.repeat_type === 'Never' || gr.repeat_type === 'Occur' || gr.repeat_type === 'On')) {
                    console.log('obj has incorrect repeat type')
                    errorAlerts.push(gr['gr_title'] + ' : Please mention one of the following in repeat_type field- Never, Occur or On.');
                }
                if (gr.repeat_type === "Occur" && gr.repeat_occurences === "") {
                    console.log('obj has no repeat occurrences')
                    errorAlerts.push(gr['gr_title'] + ' : Please mention the number of Ocurrences after which the Routine should end.');
                }
                if (gr.repeat_type === "On" && gr.repeat_ends_on === "") {
                    console.log('obj has no repeat_ends_on date')
                    errorAlerts.push(gr['gr_title'] + ' : Please mention the date this Routine should end on.');
                }
                // console.log("txt : GR keys", gr, "\n,", Object.keys(gr));
            }
        })
        if (errorAlerts.length > 1) {
            // console.log("txt",errorAlerts.length, errorAlerts[0], [1])
            alert(errorAlerts.join("\n\n"));
        }
        else {
            compareLists(array);
        }
    }
    
    // const delay = ms => new Promise(res => setTimeout(res, ms));

    const createNewGRList = (gr) => {
        var addGRobj = {
            audio: '',
            datetime_completed: gr.gr_datetime_completed,
            datetime_started: gr.gr_datetime_started,
            title: gr.gr_title,
            repeat: gr.repeat,
            repeat_frequency: gr.repeat_frequency,
            repeat_every: gr.repeat_every,
            repeat_type: gr['repeat_type'],
            repeat_ends_on: gr['repeat_ends_on'],
            repeat_occurences: gr['repeat_occurences'],
            repeat_week_days: { "0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "" },
            is_available: gr['is_available'],
            is_persistent: gr['is_persistent'],
            is_complete: gr['is_complete'],
            is_displayed_today: gr['is_displayed_today'],
            is_timed: gr['is_timed'],
            is_sublist_available: 'False',
            photo_url: undefined,// default
            // notifications: "",
            ta_notifications: { "before": { "is_enabled": gr.ta_before_is_enable, "is_set": gr.ta_before_is_set, "message": gr.ta_before_message, "time": gr.ta_before_time }, "during": { "is_enabled": gr.ta_during_is_enable, "is_set": gr.ta_during_is_set, "message": gr.ta_during_message, "time": gr.ta_during_time }, "after": { "is_enabled": gr.ta_after_is_enable, "is_set": gr.ta_after_is_set, "message": gr.ta_after_message, "time": gr.ta_after_time } },
            user_notifications: { "before": { "is_enabled": gr.user_before_is_enable, "is_set": gr.user_before_is_set, "message": gr.user_before_message, "time": gr.user_before_time }, "during": { "is_enabled": gr.user_during_is_enable, "is_set": gr.user_during_is_set, "message": gr.user_during_message, "time": gr.user_during_time }, "after": { "is_enabled": gr.user_after_is_enable, "is_set": gr.user_after_is_set, "message": gr.user_after_message, "time": gr.user_after_time } },
            user_id: userID,
            is_in_progress: gr['is_in_progress'],
            status: gr['status'],
            start_day_and_time: gr['gr_start_day_and_time'],
            end_day_and_time: gr['gr_end_day_and_time'],
            expected_completion_time: gr['gr_expected_completion_time'],
            gr_unique_id: undefined,
            ta_people_id: taID,
            photo: null
        }
        let formData = new FormData();
        Object.entries(addGRobj).forEach((entry) => {
            console.log('test-entry: ', entry);
            if (typeof entry[1] == 'string') {
                formData.append(entry[0], entry[1]);
            } else if (entry[1] instanceof Object) {
                entry[1] = JSON.stringify(entry[1]);
                formData.append(entry[0], entry[1]);
            } else {
                formData.append(entry[0], entry[1]);
            }
        });
        GRlist.push(addGRobj)
    }

    // const addNewGR = async (gr) => {
    //     var addGRobj = {
    //         audio: '',
    //         datetime_completed: gr.gr_datetime_completed,
    //         datetime_started: gr.gr_datetime_started,
    //         title: gr.gr_title,
    //         repeat: gr.repeat,
    //         repeat_frequency: gr.repeat_frequency,
    //         repeat_every: gr.repeat_every,
    //         repeat_type: gr['repeat_type'],
    //         repeat_ends_on: gr['repeat_ends_on'],
    //         repeat_occurences: gr['repeat_occurences'],
    //         repeat_week_days: { "0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "" },
    //         is_available: gr['is_available'],
    //         is_persistent: gr['is_persistent'],
    //         is_complete: gr['is_complete'],
    //         is_displayed_today: gr['is_displayed_today'],
    //         is_timed: gr['is_timed'],
    //         is_sublist_available: 'False',
    //         photo_url: undefined,// default
    //         // notifications: "",
    //         ta_notifications: { "before": { "is_enabled": gr.ta_before_is_enable, "is_set": gr.ta_before_is_set, "message": gr.ta_before_message, "time": gr.ta_before_time }, "during": { "is_enabled": gr.ta_during_is_enable, "is_set": gr.ta_during_is_set, "message": gr.ta_during_message, "time": gr.ta_during_time }, "after": { "is_enabled": gr.ta_after_is_enable, "is_set": gr.ta_after_is_set, "message": gr.ta_after_message, "time": gr.ta_after_time } },
    //         user_notifications: { "before": { "is_enabled": gr.user_before_is_enable, "is_set": gr.user_before_is_set, "message": gr.user_before_message, "time": gr.user_before_time }, "during": { "is_enabled": gr.user_during_is_enable, "is_set": gr.user_during_is_set, "message": gr.user_during_message, "time": gr.user_during_time }, "after": { "is_enabled": gr.user_after_is_enable, "is_set": gr.user_after_is_set, "message": gr.user_after_message, "time": gr.user_after_time } },
    //         user_id: userID,
    //         is_in_progress: gr['is_in_progress'],
    //         status: gr['status'],
    //         start_day_and_time: gr['gr_start_day_and_time'],
    //         end_day_and_time: gr['gr_end_day_and_time'],
    //         expected_completion_time: gr['gr_expected_completion_time'],
    //         gr_unique_id: undefined,
    //         ta_people_id: taID,
    //         photo: null
    //     }
    //     let formData = new FormData();
    //     Object.entries(addGRobj).forEach((entry) => {
    //         console.log('test-entry: ', entry);
    //         if (typeof entry[1] == 'string') {
    //             formData.append(entry[0], entry[1]);
    //         } else if (entry[1] instanceof Object) {
    //             entry[1] = JSON.stringify(entry[1]);
    //             formData.append(entry[0], entry[1]);
    //         } else {
    //             formData.append(entry[0], entry[1]);
    //         }
    //     });
    //     var insert_status;

    //     var res = await axios
    //         .post(BASE_URL + 'addGR', formData)
    //         .then((_) => {
    //             insert_status = "insert successful";
    //             console.log("txt $$$$$$", gr['gr_unique_id'], " - inserted");
    //             console.log("txt $$$$$$ : props")
    //             props.getUploadAck(addGRobj);
    //         })
    //         .catch((err) => {
    //             if (err.response) {
    //                 console.log(err.response);
    //             }
    //             insert_status = "insert failed";
    //             console.log(err);
    //         });
    //     console.log("Add GR result = ", res);
    //     return insert_status;
    // }

    const fileReader = new FileReader();

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const csvFileToArray = string => {
        var csvHeader = string.slice(0, string.indexOf("\n")).replaceAll('"', '').split(",");
        // console.log("csvHeader", csvHeader);

        if (csvHeader && csvHeader.length === 1) {
            string = string.replace(/^([^\n]*[\n]){1}/, ''); //remove first row if csv file has file name in the first row
        }
        var csvHeader = string.slice(0, string.indexOf("\n")).replaceAll('"', '').split(",");
        csvHeader = csvHeader.map(header => header.replace(/\r$/, ''));
        console.log("txt headers : ", csvHeader);

        if(csvHeader.length!==47) alert("Incorrect file headers. The upload file has to have the exact same column headers as the download file. We recommend you download a file and edit that.")
        const csvRows = string.slice(string.indexOf("\n") + 1).replaceAll('"', '').split("\n");
        // console.log("csvHeader", csvHeader);

        const array = csvRows.map(i => {
          var values = i.split(",");
          values = values.map(val => val.replace(/\r$/, ''));
          console.log("txt rows : ", values);

          const obj = csvHeader.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
          }, {});
          return obj;
        });
        // console.log("txt", array);
        // setArray(array);
        validateGR(array);
    };
    
    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (file) {
            fileReader.onload = function (event) {
                const csvOutput = event.target.result;
                csvFileToArray(csvOutput);
            };

            fileReader.readAsText(file);
        }
    };

    // const headerKeys = Object.keys(Object.assign({}, ...array));

    return (
        <div style={{ textAlign: "center" }}>
            <form>
                <input
                    type={"file"}
                    id={"csvFileInput"}
                    accept={".csv"}
                    onChange={handleOnChange}
                />

                <button
                    onClick={(e) => {
                        handleOnSubmit(e);
                    }}
                >
                    IMPORT CSV
                </button>
            </form>
        </div>
    );
}