import React, { useState, useEffect, Fragment, useContext } from "react"
import MiniNavigation from "../manifest/miniNavigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Icons from '@fortawesome/free-solid-svg-icons'
import LoginContext from "../LoginContext"
import axios from "axios"
import "../styles/History1.css"
import Moment from "moment";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function History1(){
    const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI
    const loginContext = useContext(LoginContext)
    const [currentUser, setCurrentUser] = useState(loginContext.loginState.curUser)
    const [history, setHistory] = useState([])
    const [activities, setActivities] = useState([])
    let userTimeZone = ""
    if(document.cookie.split(';').some(cookie => cookie.trim().startsWith('patient_timeZone='))){
        userTimeZone = document.cookie.split('; ').find((row) => row.startsWith('patient_timeZone=')).split('=')[1]
    }
    else{
        userTimeZone = loginContext.loginState.curUser
        document.cookie = 'patient_timeZone=' + loginContext.loginState.curUser
    }
    const time_zone = {timeZone: userTimeZone}
    const time = new Date().toLocaleString(time_zone, time_zone).replace(/,/g, '')
    let todayDate = Moment(time).format('ddd MMM D YYYY HH:mm:ss [GMT]ZZ ')
    todayDate = new Date(todayDate)
    const [currentDate, setCurrentDate] = useState(todayDate)

    useEffect(() => {
        async function getHistory(){
            //const history = await axios.get(BASE_URL + 'getHistory/' + currentUser)
            const history = await axios.get(BASE_URL + "getHistory/100-000244").then(response => response.data.result)
            let thisWeek = getThisWeek()
            const filteredHistory = filterHistory(thisWeek, history)
            const sortedHistory = sortHistory(filteredHistory)
            setHistory(sortedHistory)
        }
        getHistory()
    }, [currentDate])

    function getThisWeek() {
        let currDate = null
        if(currentDate.getUTCDay() === 0){
            currDate = new Date(currentDate.getTime() + (0 * 24 * 60 * 60 * 1000))
        }
        else if(currentDate.getUTCDay() === 1){
            currDate = new Date(currentDate.getTime() + (6 * 24 * 60 * 60 * 1000))
        }
        else if(currentDate.getUTCDay() === 2){
            currDate = new Date(currentDate.getTime() + (5 * 24 * 60 * 60 * 1000))
        }
        else if(currentDate.getUTCDay() === 3){
            currDate = new Date(currentDate.getTime() + (4 * 24 * 60 * 60 * 1000))
        }
        else if(currentDate.getUTCDay() === 4){
            currDate = new Date(currentDate.getTime() + (3 * 24 * 60 * 60 * 1000))
        }
        else if(currentDate.getUTCDay() === 5){
            currDate = new Date(currentDate.getTime() + (2 * 24 * 60 * 60 * 1000))
        }
        else if(currentDate.getUTCDay() === 6){
            currDate = new Date(currentDate.getTime() + (1 * 24 * 60 * 60 * 1000))
        }
        let week = []
        for(let i = 0; i < 7; i++){
            const day = new Date(currDate.getTime() - (i * 24 * 60 * 60 * 1000))
            week.push(day.toISOString().slice(0, 10))
        }
        return week
    }

    function filterHistory(thisWeek, history){
        let filteredHistory = []
        for(let i = 0; i < thisWeek.length; i++){
            //Check if dates affected are of this week
            if (history.filter(event => event.date_affected === thisWeek[i]).length > 0) {
                //Add dates affected of this week to temporary array
                history.filter(event => event.date_affected === thisWeek[i]).map(event => filteredHistory.push(event))
            }
            else {
                const tempEvent = {
                    id: '',
                    user_id: '',
                    date: Moment(thisWeek[i]).add('days', 1).format('YYYY-MM-DD') + ' 00:07:40',
                    date_affected: thisWeek[i],
                    details: "[]"
                }
                filteredHistory.push(tempEvent)
            }
        }
        return filteredHistory
    }

    function sortHistory(history){
        let sortedHistory = []
        let tempActivities = []
        let mostRecentDate = history.length - 1
        for(let i = 0; i < history.length; i++){
            if(JSON.parse(history[i].details).length > 0 && i < mostRecentDate ){
                mostRecentDate = i
                tempActivities = JSON.parse(history[i].details)
            }
            const date = new Date(history[i].date_affected)
            if(date.getUTCDay() === 1)
                sortedHistory[0] = JSON.parse(history[i].details)
            else if(date.getUTCDay() === 2)
                sortedHistory[1] = JSON.parse(history[i].details)
            else if(date.getUTCDay() === 3)
                sortedHistory[2] = JSON.parse(history[i].details)
            else if(date.getUTCDay() === 4)
                sortedHistory[3] = JSON.parse(history[i].details)
            else if(date.getUTCDay() === 5)
                sortedHistory[4] = JSON.parse(history[i].details)
            else if(date.getUTCDay() === 6)
                sortedHistory[5] = JSON.parse(history[i].details)
            else if(date.getUTCDay() === 0)
                sortedHistory[6] = JSON.parse(history[i].details)
        }
        setActivities(tempActivities)
        return sortedHistory
    }

    function prevWeek(){
        setCurrentDate(new Date(currentDate.getTime() - 604800000))
    }

    function nextWeek(){
        setCurrentDate(new Date(currentDate.getTime() + 604800000))
    }

    const progressCircles = history.map((activities, index) => {
        return(
            <tr key={index}>
                {activities.map((activity, index) => {
                    let status = ""
                    if(activity.status === "completed"){
                        status = <div className="cR" />
                    }
                    else if(activity.status === "not started"){
                        status = <div className="nsR" />
                    }
                    return(
                        <td key={index}>
                            {status}
                        </td>
                    )
                })}
            </tr>
        )
    })

    const activitiesElement = activities.map((item, index) => {
        console.log("history1 item", item)
        return(
            <Fragment key={index}>
                <tr>
                    <td>
                        <div>
                            {item.title + " "}
                            {item.photo !== "undefined" && <img src={item.photo}/>}
                        </div>
                    </td>
                </tr>
            </Fragment>
        )
    })

    return(
        <div className="history">
            <div className="history-nav">
                <MiniNavigation />
            </div>
            <div className="history-body">
                <div className="history-header">
                    <FontAwesomeIcon className="history-header-prev" icon={faChevronLeft} size="2x" onClick={prevWeek} />
                    <b>
                        {`Week of ${new Date(getThisWeek()[6]).toLocaleString('default', { month: 'long' })} 
                        ${new Date(getThisWeek()[6]).toISOString().slice(8, 10)} - 
                        ${new Date(getThisWeek()[0]).toISOString().slice(8, 10)}`}
                    </b>
                    {new Date(Date.now()).getDate() != currentDate.getDate() ?
                        <FontAwesomeIcon className="history-header-next" icon={faChevronRight} size="2x" onClick={nextWeek} /> :
                        <FontAwesomeIcon icon={faChevronRight} size="2x" style={{float: "right", color: "#889AB5"}} />
                    }
                    <br/>
                    {userTimeZone}
                </div>
                <div className="history-activities">
                    <table>
                        <thead>
                            <tr>
                                <td>Completed Autofilled</td>
                            </tr>
                            <tr>
                                <td>Partially Done Not Started</td>
                            </tr>
                        </thead>
                        <tbody>
                            {activitiesElement}
                        </tbody>
                    </table>
                </div>
                <div className="history-week">
                    <table>
                        <thead>
                            <tr>
                                <td>MON</td>
                                <td>TUE</td>
                                <td>WED</td>
                                <td>THUR</td>
                                <td>FRI</td>
                                <td>SAT</td>
                                <td>SUN</td>
                            </tr>
                        </thead>
                        <tbody>
                            {progressCircles}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )
}