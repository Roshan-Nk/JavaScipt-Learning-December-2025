let searchTerm;
let isSearching = false;
const searchingTxt=document.querySelector("#searching");
let long;
let lat;
let timeZone;

function searchBtn(){
    const input=document.querySelector("input");
    searchTerm=(input.value);
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
        let currentTemp= document.querySelector("#todayTemp");
        console.log("Finding data...")
        const url= new URL("https://api.open-meteo.com/v1/forecast?");
        url.searchParams.set("latitude",lat);
        url.searchParams.set("longitude",long);
        url.searchParams.set("timezone",timeZone)
        const call=await fetch(url+"&current=temperature_2m");
        if(!call.ok){
            throw new Error(`${call.status} Something went wrong with open-meteo`);
        }
        const data = await call.json();
        tempNow = data.current.temperature_2m
        currentTemp.innerHTML = `${tempNow}&deg;C`;
        
    }
    catch(err){
        console.log(err);
    }
    finally{
        
        console.log("Search complete");
        isSearching=false;

    }
};
