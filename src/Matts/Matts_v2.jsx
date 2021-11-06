import React, {useEffect, useState} from 'react';
import axios from 'axios';
  
const BASE_URL = process.env.REACT_APP_SERVER_BASE_URI;

export function MainPage() {
//    const { profile, setProfile } = useContext(AuthContext);
//    console.log(profile);

    const currentUser = "100-000027"; //matts testing 72
    const [historyGot] = useState([]);
    const inRange = [];
    const currentDate = new Date("06/22/2021");
    const mainStore = [];

    useEffect(() => {
        axios.get(BASE_URL + "getHistory/" + currentUser)
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


    function cleanData(historyGot){
        
        //go through at find historyGots that are within 7 days of currentDate
        const temp = [];
        for(var i=0; i <historyGot.length; i++){
            var historyDate = new Date(historyGot[i].date);
            if ((historyDate.getTime() <= currentDate.getTime() + 604800000)    //filter for within 7 datets
            && historyDate.getTime() >= currentDate.getTime()){                 // 7: 604800000    2: 172800000
                // console.log("found it");
                // console.log(historyGot[i].date);
                // console.log(historyGot[i].details);
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
            mainStore.push(<br />);
            mainStore.push(day.date.substring(0,10));
            mainStore.push(<br />);
            for (const routine of obj){
                 if(routine['title']){
                     console.log(routine['title'] + ". Status: " + routine['status']);
                     mainStore.push(routine.title + ". ");
                     if(routine['actions'] != undefined){
                         for (const action of routine['actions']){
                             console.log("    " + action['title'] + ". Status: " + action['status']);
                            //  mainStore.push(<p>actions.</p>)
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
        return(mainStore);
        return("merp");
    }

    
    return (
        <div>
            <div>
                <br />
            </div>
            <div className="main" style={{marginRight: 30}}>
                <p>{cleanData(historyGot)}</p>
            </div>
        </div>
    );
}


export default MainPage;