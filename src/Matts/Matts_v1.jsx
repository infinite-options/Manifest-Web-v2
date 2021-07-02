import React, {useEffect, useState} from 'react';
//import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DayRoutines from '../Home/DayRoutines';

  
export function MainPage() {
//    const { profile, setProfile } = useContext(AuthContext);
//    console.log(profile);

    const currentUser = "100-000027";
    const [historyGot] = useState([]);
    const inRange = [];
    const currentDate = new Date("06/20/2021");

    useEffect(() => {
        axios.get("https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/getHistory/" + currentUser)
        .then((response) =>{
            for(var i=0; i <response.data.result.length; i++){
               // console.log(response.data.result[i]);
                historyGot.push(response.data.result[i]);
            }
            console.log(historyGot);
            // console.log(response.data.result[1].details);
        })
        .catch((error) => {
            console.log(error);
        });
    },[])


    function cleanData(historyGot, x){
        // var historyDate = new Date("01-10-2020");
        // console.log(historyDate.getTime());
        //go through at find historyGots that are within 7 days of currentDate
        const temp = [];
        for(var i=0; i <historyGot.length; i++){
            var historyDate = new Date(historyGot[i].date);
            if ((historyDate.getTime() <= currentDate.getTime() + 604800000)    //filter for within 7 datets
            && historyDate.getTime() >= currentDate.getTime()){                 // 7: 604800000    2: 172800000
                // console.log("found it");
                // console.log(historyGot[i].date);
                // console.log(historyGot[i].details);
                // pushUnique(historyGot[i]);
                temp.push(historyGot[i]);
            }
        }
        //now temp has data we want
       // move temp to inRange with no repeats
        const map = new Map();
        for (const item of temp){
            if(!map.has(item.date)){
                map.set(item.date, true);
                inRange.push({
                    date: item.date,
                    details: item.details
                })
            }
        }

        console.log(inRange);
        console.log("Length:" + inRange.length);
        for (const day of inRange){
            const obj = JSON.parse(day.details);
            console.log(day.date);
            console.log(obj);
            for (const routine of obj){
                 if(routine['title']){
                     console.log(routine['title'] + ". Status: " + routine['status']);
                     if(routine['actions'] != undefined){
                         for (const action of routine['actions']){
                             console.log("    " + action['title'] + ". Status: " + action['status']);
                             if(action['instructions'] != undefined){
                                for(const instruction of action['instructions']){
                                    console.log("         " + instruction['title'] + ". Status: " + instruction['status']);
                                } 
                             }
                         }
                     }
                 }
             }
        }

        console.log(inRange.date);
        return(inRange[x].date);
        return("merp");
    }

    function helper(historyGot){
        const dates = [];
        for (var i=0; i<7; i++){
            dates.push(<p>{cleanData(historyGot, i)}</p>);
        }
        return(<p>{dates}</p>);
    }

    return (
        <div>
            <div>
                <h1>hi</h1>
            </div>
            <div className="main">
                <p>here: {helper(historyGot)}</p>
            </div>
        </div>
    );
}


export default MainPage;