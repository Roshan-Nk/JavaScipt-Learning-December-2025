let searchTerm;
let isSearching = false;
const searchingTxt=document.querySelector("#searching");
let long;
let lat;
let timeZone;
const currentDate = new Date();
let Weekday =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const currentDay = currentDate.getDay();
const currentDateA = currentDate.getDate();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();
const currentHour = currentDate.getHours();
const futureTime =[];
let hoursFormated;



function searchBtn(){
    const input=document.querySelector("input");
    searchTerm=(input.value);
    futureTime.push(currentHour);
    let hour =currentHour+1;
    for(let i=0;i<6;i++){
        futureTime.push(hour);
        hour++
    }
    console.log(futureTime);
    getLongAndLat();
    
}

async function getLongAndLat(){
    try{
        
        console.log("Searching...")
        const apikey = "4926c30388d04b78974d2558e158896b",
        isSearching=true;
        const url = new URL("https://api.geoapify.com/v1/geocode/search?");
        url.searchParams.set("text",searchTerm);
        url.searchParams.set("apiKey",apikey);
        const call = await fetch(url);
        if(!call.ok){
            throw new Error(`${call.status} Something went wrong with geoapify`);
        }
        const data = await call.json();
        long=data.features[0].properties.lon;
        lat=data.features[0].properties.lat;
        timeZone=data.features[0].properties.timezone.abbreviation_STD;
        console.log("Found long ,lat & timezone "+long," " ,lat+" "+timeZone)
        getData();
    }

    catch(err){
        console.log(err)
    }

    finally{
        
        searchTerm="";
    }
}

async function getData(){
    try{
        let tempNow;
        let tempArray;
        let currentTemp= document.querySelector("#todayTemp");
        console.log("Finding data...")
        const url= new URL("https://api.open-meteo.com/v1/forecast?");
        url.searchParams.set("latitude",lat);
        url.searchParams.set("longitude",long);
        url.searchParams.set("timezone",timeZone)
        url.searchParams.set("current","temperature_2m")
        url.searchParams.set("hourly","temperature_2m")
        console.log(url)
        const call=await fetch(url);
        if(!call.ok){
            throw new Error(`${call.status} Something went wrong with open-meteo`);
        }
        const data = await call.json();
        tempNow = data.current.temperature_2m
        currentTemp.innerHTML = `${tempNow}&deg;C`;


        hoursFormated=futureTime.map(f=>{
            let period = f<=11 ? "AM":"PM";
            let hour12= f = f%12 || 12;
            return hour12 +" "+period;
        })


        document.getElementById("day1").innerText=data.hourly.temperature_2m[futureTime[0]];
        document.getElementById("day2").innerText=data.hourly.temperature_2m[futureTime[1]];
        document.getElementById("day3").innerText=data.hourly.temperature_2m[futureTime[2]];
        document.getElementById("day4").innerText=data.hourly.temperature_2m[futureTime[3]];
        document.getElementById("day5").innerText=data.hourly.temperature_2m[futureTime[4]];
        document.getElementById("day6").innerText=data.hourly.temperature_2m[futureTime[5]];
        document.getElementById("todayDate").innerText=`${currentDateA}/${currentMonth}/${currentYear}`;
        document.getElementById("todayDay").innerText=Weekday[currentDay];
        document.getElementById("todayTime").innerText=hoursFormated[0];
        document.getElementById("day1Time").innerText=hoursFormated[1];
        document.getElementById("day2Time").innerText=hoursFormated[2];
        document.getElementById("day3Time").innerText=hoursFormated[3];
        document.getElementById("day4Time").innerText=hoursFormated[4];
        document.getElementById("day5Time").innerText=hoursFormated[5];
        document.getElementById("day6Time").innerText=hoursFormated[6];
        
    }
    catch(err){
        console.log(err);
    }
    finally{
        
        console.log("Search complete");
        isSearching=false;

    }
};
