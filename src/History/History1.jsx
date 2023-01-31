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
    const week = ["MON", "TUE", "WED", "THUR", "FRI", "SAT", "SUN"]
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
            let tempHistory = []
            for(let i = 0; i < thisWeek.length; i++){
                //Check if dates affected are of this week
                if (history.filter(event => event.date_affected === thisWeek[i]).length > 0) {
                    //Add dates affected of this week to temporary array
                    history.filter(event => event.date_affected === thisWeek[i]).map(event => tempHistory.push(event))
                }
                else {
                    const tempEvent = {
                        id: '',
                        user_id: '',
                        date: Moment(thisWeek[i]).add('days', 1).format('YYYY-MM-DD') + ' 00:07:40',
                        date_affected: thisWeek[i],
                        details: ''
                    }
                    tempHistory.push(tempEvent)
                }
            }
            setHistory(JSON.parse(tempHistory[tempHistory.length - 1].details))
        }
        getHistory()
    }, [])

    function getThisWeek() {
        const day = Moment().format();
        const x = Moment().date(day);
        const temp = {
            d: Moment().subtract(1, 'days').format('DD'),
            m: Moment().format('MM'),
            y: Moment().format('YYYY'),
        }
        const numDaysInMonth = Moment().daysInMonth();
        return Array.from({ length: 15 }, (_) => {
            if (temp.d > numDaysInMonth) {
                temp.m += 1
                temp.d = 1
            }
            const newDate = Moment().set({
                year: temp.y,
                month: temp.m - 1,
                date: temp.d--,
            })
            let x =
                Moment(newDate).format('YYYY') + '-' +
                Moment(newDate).format('MM') + '-' +
                Moment(newDate).format('DD');
            return x
        })
    }

    function prevWeek(){
        setCurrentDate(new Date(currentDate.getTime() - 604800000))
    }

    function nextWeek(){
        setCurrentDate(new Date(currentDate.getTime() + 604800000))
    }

    const activitiesElement = history.map((item, index) => {
        return(
            <Fragment>
                <tr>
                    <td>{item.title}</td>
                </tr>
            </Fragment>
        )
    })

    const progressCircles = history.map((item, index) => {
        return(
            <Fragment key={index}>
                <tr>
                    {week.map(day => {
                        return(
                            <td> {item.title}</td>
                        )
                    })}
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
                        {`Week of ${Moment(currentDate.getTime() - 604800000).format('MMMM D')} - 
                        ${Moment(currentDate.getTime() - 86400000).format('D, YYYY')}`}
                    </b>
                    {new Date(Date.now()).getDate() != currentDate.getDate() ?
                        <FontAwesomeIcon className="history-header-next" icon={faChevronRight} size="2x" onClick={nextWeek} /> :
                        <FontAwesomeIcon icon={faChevronRight} size="2x" style={{float: "right", color: "#889AB5"}} />
                    }
                    <br/>
                    {userTimeZone}
                </div>
                <div className="history-legend">
                    <span>Completed Autofilled</span>
                    <br/>
                    <span>Partially Done Not Started</span>
                </div>
                <div className="history-activities">
                    <table>
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

//yellow filled circle <div className="cR"></div>