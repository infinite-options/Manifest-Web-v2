import React, { useState, useEffect, Fragment, useContext } from "react"
import LoginContext from "../LoginContext"
import axios from "axios"
import PhoneInput from "react-phone-number-input"
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { Button, Form, FormLabel, Modal } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "react-phone-number-input/style.css"
import "../styles/About1.css"

export default function About1(){
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI
    const loginContext = useContext(LoginContext)
    let userID = loginContext.loginState.curUser
    userID = "100-000244"

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
    const [displayImageUploader, setDisplayImageUploader] = useState(false)
    const [uploadedImage, setUploadedImage] = useState({pic: "", url: ""})
    const [imageUploader, setImageUploader] = useState("")

    const [importantPeople, setImportantPeople] = useState([])
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
            setImportantPeople(importantPeople)
        }
        getUser()
        getImportantPeople()
    }, [])

    function handleTimeChange(event){
        if(imageUploader === "user"){
            setUserObject({
                ...userObject,
                timeSettings: {
                    ...userObject.timeSettings,
                    morning: event.target.value
                }})
        }
        else{

        }
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
            message_day: event.target.value,
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
            const updatedUserObject = {
                ...userObject,
                have_pic: true,
                pic: uploadedImage.pic,
                picURL: uploadedImage.url
            }
            setUserObject(updatedUserObject)
            await updateUser(updatedUserObject)
        }
        else{
            for(let i = 0; i < importantPeople.length; i++){
                if(importantPeople[i].ta_people_id === imageUploader){
                    importantPeople[i].pic = uploadedImage.url
                    await updateImportantPerson(importantPeople[i], uploadedImage)
                }
            }
        }
        setDisplayImageUploader(false)
        setUploadedImage({
            ...uploadedImage,
            pic: "",
            url: ""
        })
    }

    function handleImageCancel(){
        setDisplayImageUploader(false)
        setUploadedImage({
            ...uploadedImage,
            pic: "",
            url: ""
        })
        setImageUploader("")
    }

    function handleImageUserClick(){
        setDisplayImageUploader(true)
        setImageUploader("user")
    }

    function editImportantPerson(ta_id){
        setDisplayImageUploader(true)
        setImageUploader(ta_id)
    }

    function deleteImportantPerson(ta_id){
        setImageUploader(ta_id)
    }

    async function updateImportantPerson(importantPerson, uploadedImage){
        let formData = new FormData()
        formData.append("user_id", userID)
        formData.append("ta_people_id", importantPerson.ta_people_id)
        formData.append("people_name", importantPerson.name)
        formData.append("people_email", importantPerson.email)
        formData.append("people_employer", importantPerson.employer)
        formData.append("people_relationship", importantPerson.relationship)
        formData.append("people_phone_number", importantPerson.phone_number.replace(/\D/g, ''))
        formData.append("people_important", "True")
        formData.append("people_have_pic", "True")
        formData.append("people_pic", uploadedImage.pic)
        formData.append("photo_url", uploadedImage.url)
        formData.append("ta_time_zone", importantPerson.time_zone)
        await axios.post(BASE_URL + "updatePeople", formData)
    }

    async function updateUser(userObject){
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
    }

    const dayTimes = [["Morning", "Afternoon"], ["Evening", "Night"], ["Day Start", "Day End"]]
    const dayTimesElement = dayTimes.map((times, index) => {
        return(
            <tr key={index}>
                {times.map((time, index) => {
                    return(
                        <Fragment key={index}>
                            <td><p className="about-time-text">{time}</p></td>
                            <td><input className="about-time-input" value={userObject.timeSettings.morning || ''} onChange={event => handleTimeChange(event)} /></td>
                        </Fragment>
                    )})}
            </tr>
        )})

    const colTwoInfo = ["Current Medication", "Notes", "Medication Schedule"]
    const colTwoElement = colTwoInfo.map((info, index) => {
        return(
            <Fragment key={index}>
                <Form.Label><b>{info}</b></Form.Label>
                <Form.Control className="about-column2-input" as="textarea" type="text"  rows="4" onChange={event => handleMedicationChange(event)}/>
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
            <Modal show={displayImageUploader} onHide={() => setDisplayImageUploader(false)}>
                <Modal.Header>
                    <Modal.Title>Upload Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="file" onChange={event => handleImageChange(event)} />
                    <br/><br/>
                    <img src={uploadedImage.url || "http://via.placeholder.com/400x300"} height="300" width="400" />
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
                <div className="about-column1">
                    <FormLabel className="about-input">First Name:</FormLabel>
                    <Form.Control type="text" placeholder="First Name" />
                    <br/>
                    <FormLabel className="about-input">Last Name:</FormLabel>
                    <Form.Control type="text" placeholder="Last Name" />
                    <br/>
                    <b>Email:</b>
                    <br/><br/>
                    testEmail@test.com
                    <br/><br/>
                    <b>User id:</b>
                    <br/><br/>
                    100-00222
                    <br/><br/>
                    <h4>Change Image</h4>
                    <div className="about-image-container">
                        <div className="about-image-text">
                            <div onClick={handleImageUserClick}>Upload from Computer</div>
                            <div>User's Library</div>
                            <div>Upload from Google Photos</div>
                        </div>
                        <img className="about-image" src={userObject.picURL || "UserNoImage.png"}/>
                    </div>
                    <br/>
                    <label className="about-input">Birth Date:</label>
                    <Form.Control type="date" dateFormat="MMMM d, yyyy"/>
                    <br/>
                    <label className="about-input">Phone Number:</label>
                    <PhoneInput class="form-control" placeholder="Enter phone number"/>
                    <br/>
                    <b>Time Settings</b>
                    <br/>
                    <input className="about-input" type="text" placeholder="Time Zone"/>
                    <br/><br/>
                    <table>
                        <tbody>
                        {dayTimesElement}
                        </tbody>
                    </table>
                    <br/>
                </div>
                <div className="about-column2">
                    {colTwoElement}
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
            <div className="about-save-container">
                <button className="about-save-button" type="submit" onClick={() => updateUser(userObject)}>
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