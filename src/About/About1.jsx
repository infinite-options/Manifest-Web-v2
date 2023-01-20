import React, {useState, useEffect, Fragment, useContext} from "react"
import LoginContext from "../LoginContext"
import axios from "axios"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import "../styles/About1.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import {Button, Form, FormLabel, Modal, ModalBody} from "react-bootstrap"

export default function About1(){
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI
    const loginContext = useContext(LoginContext)
    let userID = loginContext.loginState.curUser
    userID = "100-000244"

    const[userObject, setUserObject] = useState({
        phone_number: "5105085059",
        timeSettings: {
        }
    })
    const [taObject, setTaObject] = useState({})
    const [displayImageUploader, setDisplayImageUploader] = useState(false)
    const [uploadedImage, setUploadedImage] = useState("")
    const [imageUploader, setImageUploader] = useState("")

    const [importantPeople, setImportantPeople] = useState([])
    useEffect(() => {
        async function getImportantPeople(){
            const importantPeople = await axios.get(BASE_URL + "listPeople/" + userID)
                .then(response => response.data.result.result)
            console.log("about1 importantPeople: ", importantPeople)
            setImportantPeople(importantPeople)
        }
        //getImportantPeople()
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
        setUploadedImage(URL.createObjectURL(uploadedImage))
    }

    function handleImageConfirm(){
        if (!uploadedImage) {
            alert('Please select an image to upload')
            return
        }
        if(imageUploader === "user"){
            setUserObject({
                ...userObject,
                pic: uploadedImage
            })
        }
        else{
            for(let i = 0; i < importantPeople.length; i++){
                if(importantPeople[i].ta_people_id === imageUploader){
                    importantPeople[i].pic = uploadedImage
                    // let formData = new FormData()
                    // axios.post(BASE_URL + "updatePeople", importantPeople[i])
                }
            }
        }
        setDisplayImageUploader(false)
        setUploadedImage("")
    }

    function handleImageCancel(){
        setDisplayImageUploader(false)
        setUploadedImage("")
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

    const importantPeopleElement = importantPeople.map((person, index) => {
        return(
            <Fragment key={index}>
                <div className="about-important-container">
                    <img className="about-important-pic" src={person.have_pic ? person.pic : "UserNoImage.png"}/>
                    <p className="about-important-name">{person.name}</p>
                    <FontAwesomeIcon className="about-important-icon" icon={faEdit} title="Edit Person" size="sm" onClick={() => editImportantPerson(person.ta_people_id)} />
                    <FontAwesomeIcon className="about-important-icon" icon={faTrashAlt} title="Delete Person" size="sm" onClick={() => deleteImportantPerson(person.ta_people_id)} />
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
                    <img src={uploadedImage || "http://via.placeholder.com/400x300"} height="300" width="400" />
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
                        <img className="about-image" src={userObject.pic || "UserNoImage.png"}/>
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
                <button className="about-save-button" type="submit">
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