import React, { useState, useEffect, Fragment, useContext } from "react"
import LoginContext from "../LoginContext"
import axios from "axios"
import MiniNavigation from '../manifest/miniNavigation'
import PhoneInput from "react-phone-number-input"
import {Button, Col, Form, FormLabel, Modal, Row} from "react-bootstrap"
import { FormControl, MenuItem, Select } from "@material-ui/core"
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "react-phone-number-input/style.css"
import "../styles/About1.css"
import TAUploadImage from "../Home/TAUploadImage";
import TAGooglePhotos from "../Home/TAGooglePhotos";

export default function About1(){
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI
    const loginContext = useContext(LoginContext)
    let userID = ""
    if(document.cookie.split(';').some(cookie => cookie.trim().startsWith('patient_uid='))){
        userID = document.cookie.split('; ').find((row) => row.startsWith('patient_uid=')).split('=')[1]
    }
    else{
        userID = loginContext.loginState.curUser
        document.cookie = 'patient_uid=' + loginContext.loginState.curUser
    }
    const [userObject, setUserObject] = useState({
        first_name: "",
        last_name: "",
        email: "",
        birth_date: new Date(),
        birth_date_change: false,
        phone_number: "",
        have_pic: false,
        message_card: "",
        message_day: "",
        history: "",
        major_events: "",
        pic: null,
        picURL: "",
        timeSettings: {
            morning: "",
            afternoon: "",
            evening: "",
            night: "",
            dayStart: "",
            dayEnd: "",
            timeZone: ""
        }
    })
    const [taObject, setTaObject] = useState({})
    const [importantPeople, setImportantPeople] = useState([])
    const [displayImageUploader, setDisplayImageUploader] = useState(false)
    const [displayChangesSaved, setDisplayChangesSaved] = useState(false)
    const [displayEditImportantPerson, setDisplayEditImportantPerson] = useState(false)
    const [uploadedImage, setUploadedImage] = useState({pic: "", url: ""})
    const [imageUploader, setImageUploader] = useState("")
    const dayTimes = [["Morning", "Afternoon"], ["Evening", "Night"], ["Day Start", "Day End"]]
    const medicationInfo = ["Current Medication", "Notes", "Medication Schedule"]
    const timeZones = {
        'Pacific/Samoa': '(GMT-11:00)',
        'Pacific/Honolulu': '(GMT-10:00)',
        'Pacific/Marquesas': '(GMT-09:30)',
        'America/Juneau': '(GMT-09:00)',
        'America/Los_Angeles': '(GMT-08:00)',
        'America/Phoenix': '(GMT-07:00)',
        'America/Chicago': '(GMT-06:00)',
        'America/New_York': '(GMT-05:00)',
        'America/Puerto_Rico': '(GMT-04:00)',
        'Canada/Newfoundland': '(GMT-03:30)',
        'America/Buenos_Aires': '(GMT-03:00)',
        'America/Noronha': '(GMT-02:00)',
        'Atlantic/Azores': '(GMT-01:00)',
        'Europe/London': '(GMT+00:00)',
        'Europe/Berlin': '(GMT+01:00)',
        'Asia/Jerusalem': '(GMT+02:00)',
        'Europe/Moscow': '(GMT+03:00)',
        'Asia/Tehran': '(GMT+03:30)',
        'Asia/Dubai': '(GMT+04:00)',
        'Asia/Kabul': '(GMT+04:30)',
        'Asia/Karachi': '(GMT+05:00)',
        'Asia/Calcutta': '(GMT+05:30)',
        'Asia/Almaty': '(GMT+06:00)',
        'Indian/Cocos': '(GMT+06:30)',
        'Asia/Bangkok': '(GMT+07:00)',
        'Asia/Hong_Kong': '(GMT+08:00)',
        'Asia/Tokyo': '(GMT+09:00)',
        'Australia/Darwin': '(GMT+09:30)',
        'Australia/Brisbane': '(GMT+10:00)',
        'Australia/Lord_How': '(GMT+10:30)',
        'Asia/Magadan': '(GMT+11:00)',
        'Pacific/Fiji': '(GMT+12:00)',
        'Pacific/Apia': '(GMT+13:00)',
        'Pacific/Kiritimati': '(GMT+14:00)',
    }

    useEffect(() => {
        async function getUser(){
            const userObjectInfo = await axios.get(BASE_URL + "aboutme/" + userID)
                .then(response => response.data.result[0])
            const userObject = {
                first_name: userObjectInfo.user_first_name,
                last_name: userObjectInfo.user_last_name,
                email: userObjectInfo.user_email_id,
                birth_date: userObjectInfo.user_birth_date,
                phone_number: userObjectInfo.user_phone_number,
                have_pic: userObjectInfo.user_have_pic === "False" ? false : true,
                message_card: userObjectInfo.message_card,
                message_day: userObjectInfo.message_day,
                pic: "",
                picURL: userObjectInfo.user_picture,
                history: userObjectInfo.user_history,
                major_events: userObjectInfo.user_major_events,
                timeSettings: {
                    morning: userObjectInfo.morning_time,
                    afternoon: userObjectInfo.afternoon_time,
                    evening: userObjectInfo.evening_time,
                    night: userObjectInfo.night_time,
                    dayStart: userObjectInfo.day_start,
                    dayEnd: userObjectInfo.day_end,
                    timeZone: userObjectInfo.time_zone
                }
            }
            setUserObject(userObject)
        }
        async function getImportantPeople(){
            const importantPeople = await axios.get(BASE_URL + "listPeople/" + userID)
                .then(response => response.data.result.result)
            console.log("about1:", importantPeople)
            setImportantPeople(importantPeople)
        }
        getUser()
        getImportantPeople()
    }, [])

    function FirstNameChange(event){
        setUserObject({
            ...userObject,
            first_name: event.target.value
        })
    }

    function LastNameChange(event){
        setUserObject({
            ...userObject,
            last_name: event.target.value
        })
    }

    function handleTimeChange(event){
        setUserObject({
            ...userObject,
            timeSettings: {
                ...userObject.timeSettings,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleZoneChange(event){
        event.stopPropagation();
        setUserObject({
            ...userObject,
            timeSettings: {
                ...userObject.timeSettings,
                timeZone: event.target.value,
            }
        })
    }

    function handleBirthChange(event){
        setUserObject({
            ...userObject,
            birth_date: event.target.value,
            birth_date_change: true
        })
    }

    function handlePhoneChange(event){
        setUserObject({
            ...userObject,
            phone_number: event
        })
    }

    function handleMedicationChange(event){
        setUserObject({
            ...userObject,
            [event.target.name]: event.target.value
        })
    }

    function handleImageChange(event){
        const uploadedImage = event.target.files[0]
        setUploadedImage({
            ...uploadedImage,
            pic: uploadedImage,
            url: URL.createObjectURL(uploadedImage)
        })
    }

    async function handleImageConfirm(){
        if (!uploadedImage) {
            alert('Please select an image to upload')
            return
        }
        if(imageUploader === "user"){
            setUserObject({
                ...userObject,
                have_pic: true,
                pic: uploadedImage.pic,
                picURL: uploadedImage.url
            })
            setUploadedImage({
                ...uploadedImage,
                pic: "",
                url: ""
            })
        }
        else{
            setTaObject({
                ...taObject,
                have_pic: true,
                photo: uploadedImage.pic,
                pic: uploadedImage.url
            })
        }
        setDisplayImageUploader(false)
    }

    function handleImageCancel(){
        if(imageUploader === "user"){
            setUploadedImage({
                ...uploadedImage,
                pic: "",
                url: ""
            })
            setImageUploader("")
        }
        setDisplayImageUploader(false)
    }

    function handleImageClick(id){
        setDisplayImageUploader(true)
        setImageUploader(id)
    }

    function editImportantPerson(id){
        for(let i = 0; i < importantPeople.length; i++){
            if(importantPeople[i].ta_people_id === id){
                setTaObject(importantPeople[i])
            }
        }
        setDisplayEditImportantPerson(true)
    }

    function deleteImportantPerson(id){

    }

    async function handleSaveChangesClick(){
        await updateUser(userObject)
        setDisplayChangesSaved(true)
    }

    function handleEditImportantPersonCancel(){
        setTaObject({})
        setDisplayEditImportantPerson(false)
        setUploadedImage({
            ...uploadedImage,
            pic: "",
            url: ""
        })
    }

    function handleEditImportantPersonConfirm(){
        for(let i = 0; i < importantPeople.length; i++){
            if(importantPeople[i].ta_people_id === taObject.ta_people_id){
                importantPeople[i].pic = uploadedImage.url
            }
        }
        setTaObject({})
        updateImportantPerson(taObject)
        setDisplayEditImportantPerson(false)
        setDisplayChangesSaved(true)
        setUploadedImage({
            ...uploadedImage,
            pic: "",
            url: ""
        })
    }

    async function updateImportantPerson(taObject){
        console.log("about1:", taObject.pic)
        let formData = new FormData()
        formData.append("user_id", userID)
        formData.append("ta_people_id", taObject.ta_people_id)
        formData.append("people_name", taObject.name)
        formData.append("people_email", taObject.email)
        formData.append("people_employer", taObject.employer)
        formData.append("people_relationship", taObject.relationship)
        formData.append("people_phone_number", taObject.phone_number.replace(/\D/g, ''))
        formData.append("people_important", "True")
        formData.append("people_have_pic", "True")
        formData.append("people_pic", taObject.photo)
        formData.append("photo_url", taObject.pic)
        formData.append("ta_time_zone", taObject.time_zone)
        await axios.post(BASE_URL + "updatePeople", formData)
    }

    async function updateUser(userObject){
        console.log("about1 userObject: ", userObject)
        let formData = new FormData()
        formData.append("user_id", userID)
        formData.append("first_name", userObject.first_name)
        formData.append("last_name", userObject.last_name)
        formData.append("have_pic", userObject.have_pic)
        formData.append("message_card", userObject.message_card)
        formData.append("message_day", userObject.message_day)
        formData.append("timeSettings", JSON.stringify(userObject.timeSettings))
        formData.append("history", userObject.history)
        formData.append("major_events", userObject.major_events)
        formData.append("phone_number", userObject.phone_number)
        formData.append("birth_date", userObject.birth_date)
        formData.append("photo_url", userObject.picURL)
        formData.append("picture", userObject.pic)
        await axios.post(BASE_URL + "updateAboutMe", formData)
        document.cookie = "patient_pic=" + userObject.picURL
        document.cookie = "patient_timeZone=" + userObject.timeSettings.timeZone
    }

    const dayTimesElement = dayTimes.map((times, index) => {
        return(
            <tr key={index}>
                {times.map((time, index) => {
                    let name = time.toLowerCase()
                    if(time === "Day Start")
                        name = "dayStart"
                    else if(time === "Day End")
                        name = "dayEnd"
                    return(
                        <Fragment key={index}>
                            <td><p className="about-time-text">{time}</p></td>
                            <td><input className="about-time-input" name={name} value={userObject.timeSettings[name]} onChange={event => handleTimeChange(event)} /></td>
                        </Fragment>
                    )})}
            </tr>
        )
    })

    const medicationElement = medicationInfo.map((info, index) => {
        let name = info
        if(info === "Current Medication")
            name = "message_day"
        if(info === "Notes")
            name = "message_card"
        if(info === "Medication Schedule")
            name = "major_events"
        return(
            <Fragment key={index}>
                <Form.Label><b>{info}</b></Form.Label>
                <Form.Control className="about-column2-input" as="textarea" type="text" rows="4" name={name} onChange={event => handleMedicationChange(event)} />
                <br/>
            </Fragment>
        )
    })

    const importantPeopleElement = importantPeople.map((importantPerson, index) => {
        return(
            <Fragment key={index}>
                <div className="about-important-container">
                    <img className="about-important-pic" src={importantPerson.have_pic ? importantPerson.pic : "UserNoImage.png"}/>
                    <p className="about-important-name">{importantPerson.name}</p>
                    <FontAwesomeIcon className="about-important-icon" icon={faEdit} title="Edit Person" size="sm" onClick={() => editImportantPerson(importantPerson.ta_people_id)} />
                    <FontAwesomeIcon className="about-important-icon" icon={faTrashAlt} title="Delete Person" size="sm" onClick={() => deleteImportantPerson(importantPerson.ta_people_id)} />
                </div>
                <br/>
            </Fragment>
        )
    })

    return(
        <div>
            {displayChangesSaved &&
                <div className="about-changes-container">
                    <div className="about-changes-text-container">
                        <div className="about-changes-text">
                            Changes saved
                        </div>
                        <div className="about-changes-text">
                            User's about me changes have been saved.
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button className="about-changes-button" onClick={() => setDisplayChangesSaved(false)}>
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
            }
            <Modal show={displayEditImportantPerson} onHide={() => setDisplayEditImportantPerson(false)}>
                <Modal.Header>
                    <Modal.Title>Person Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormLabel>Full Name</FormLabel>
                    <Form.Control type="text" placeholder={taObject.name || "Full Name"} />
                    <br/>
                    <FormLabel>Change Image</FormLabel>
                    <div className="about-image-container">
                        <div className="about-image-text">
                            <div onClick={() => handleImageClick(taObject.ta_people_id)}>Upload from Computer</div>
                            <div>User's Library</div>
                            <div>Upload from Google Photos</div>
                        </div>
                        <img className="about-image" src={taObject.pic || "UserNoImage.png"}/>
                    </div>
                    <br/>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl fullWidth>
                        <Select
                            value={taObject.relationship}
                            style={{
                                backgroundColor: '#ffffff',
                                paddingLeft: '15px',
                            }}
                            renderValue={() => {
                                if (taObject.relationship === '') {
                                    return <div>Enter a relationship</div>;
                                }
                                return taObject.relationship;
                            }}
                            onChange={(e) => {
                                setTaObject({
                                    ...taObject,
                                    relationship: e.target.value,
                                });
                            }}
                        >
                            <MenuItem value={'Advisor'}>{'Advisor'}</MenuItem>
                            <MenuItem value={'Friend'}>{'Friend'}</MenuItem>
                            <MenuItem value={'Relative'}>{'Relative'}</MenuItem>
                        </Select>
                    </FormControl>
                    <br/><br/>
                    <FormControl fullWidth>
                        <Select
                            value={userObject.timeSettings.timeZone.split('_').join(' ') || ''}
                            style={{ backgroundColor: '#ffffff', paddingLeft: '15px' }}
                            onChange={event => handleZoneChange(event)}
                            renderValue={() => {
                                if (userObject.timeSettings.timeZone === '')
                                    return <div>Enter a timezone</div>
                                return userObject.timeSettings.timeZone.split('_').join(' ')
                            }}
                        >
                            {Object.keys(timeZones).map(zone => (
                                <MenuItem value={zone}>
                                    {`${zone.split('_').join(' ')} ${timeZones[zone] }`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <br/><br/>
                    <label>Phone Number</label>
                    <Form.Control
                        type="phone"
                        value={taObject.phone_number}
                        placeholder="Enter phone number"
                        onChange={(e) => {
                            const re = /\D/g;
                            const test = e.target.value.replace(re, '');
                            if (test.length > 10) return;
                            setTaObject({
                                ...taObject,
                                phone_number: e.target.value,
                            });
                        }}
                    />
                    <br/>
                    <label>Email Address</label>
                    <Form.Control
                        type="email"
                        placeholder="Email Address"
                        value={taObject.email}
                        onChange={(e) => {
                            setTaObject({
                                ...taObject,
                                email: e.target.value,
                            });
                        }}
                    />
                    <br/>
                    <label>Employer</label>
                    <Form.Control
                        type="text"
                        placeholder="Employer"
                        value={taObject.employer}
                        onChange={(e) => {
                            setTaObject({
                                ...taObject,
                                employer: e.target.value,
                            });
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditImportantPersonCancel}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEditImportantPersonConfirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={displayImageUploader} onHide={() => setDisplayImageUploader(false)}>
                <Modal.Header>
                    <Modal.Title>Upload Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="file" onChange={event => handleImageChange(event)} />
                    <br/><br/>
                    <img src={uploadedImage.url || "https://via.placeholder.com/400x300"} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleImageCancel()}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => handleImageConfirm()}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="about">
                <div className="about-nav">
                    <MiniNavigation />
                </div>
                <div className="about-body">
                    <div className="about-column1">
                        <FormLabel className="about-input">First Name:</FormLabel>
                        <Form.Control type="text" value={userObject.first_name} placeholder="First Name" onChange={event => FirstNameChange(event)}/>
                        <br/>
                        <FormLabel className="about-input">Last Name:</FormLabel>
                        <Form.Control type="text" value={userObject.last_name} placeholder="Last Name" onChange={event => LastNameChange(event)}/>
                        <br/>
                        <b>Email:</b>
                        <br/>
                        {userObject.email}
                        <br/><br/>
                        <b>User id:</b>
                        <br/>
                        {userID}
                        <br/><br/>
                        <h4>Change Image</h4>
                        <div className="about-image-container">
                            <div className="about-image-text">
                                <div onClick={() => handleImageClick("user")}>Upload from Computer</div>
                                <div>User's Library</div>
                                <div>Upload from Google Photos</div>
                            </div>
                            <img className="about-image" src={userObject.picURL || "UserNoImage.png"}/>
                        </div>
                        <br/>
                        <label className="about-input">Birth Date:</label>
                        <Form.Control type="date" dateFormat="MMMM d, yyyy" value={userObject.birth_date} onChange={event => handleBirthChange(event)}/>
                        <br/>
                        <PhoneInput class="form-control" value={userObject.phone_number} placeholder="Enter phone number" onChange={event => handlePhoneChange(event)}/>
                        <br/>
                        <b>Time Settings</b>
                        <br/>
                        <FormControl fullWidth>
                            <Select
                                placeholder={userObject.timeSettings.timeZone}
                                value={userObject.timeSettings.timeZone.split('_').join(' ') || ''}
                                style={{ backgroundColor: '#ffffff', paddingLeft: '15px' }}
                                onChange={event => handleZoneChange(event)}
                                renderValue={() => {
                                    if (userObject.timeSettings.timeZone === '')
                                        return <div>Enter a timezone</div>
                                    return userObject.timeSettings.timeZone.split('_').join(' ')
                                }}
                            >
                                {Object.keys(timeZones).map(zone => (
                                    <MenuItem value={zone}>
                                        {`${zone.split('_').join(' ')} ${timeZones[zone] }`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <br/><br/>
                        <table>
                            <tbody>
                            {dayTimesElement}
                            </tbody>
                        </table>
                        <br/>
                    </div>
                    <div className="about-column2">
                        {medicationElement}
                    </div>
                    <div className="about-column3">
                        <b>Important People In Life</b>
                        <br/><br/>
                        {importantPeopleElement}
                        <button className="about-important-button">
                            Add Person +
                        </button>
                    </div>
                </div>
            </div>
            <div className="about-save-container">
                <button className="about-save-button" type="submit" onClick={handleSaveChangesClick}>
                    Save Changes
                </button>
                <button className="about-save-button" type="submit">
                    Cancel
                </button>
                <button className="about-save-button" type="submit">
                    Delete User
                </button>
            </div>
        </div>
    )
}