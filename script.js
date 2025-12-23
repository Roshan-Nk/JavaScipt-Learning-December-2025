// Search text entered by user
let searchTerm;

// Flag indicating search state
let isSearching = false;

// Unused DOM reference (kept as-is)
const searchingTxt = document.querySelector("#searching");

// Coordinates and timezone
let long;
let lat;
let timeZone;

// Current date and time
const currentDate = new Date();

// Weekday names
let Weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

// Date breakdown
const currentDay = currentDate.getDay();
const currentDateA = currentDate.getDate();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();
const currentHour = currentDate.getHours();

// Stores current + future hours
const futureTime = [];

// Formatted hour labels (AM/PM)
let hoursFormated;

// Loader element
const loader = document.querySelector("#loader");

/**
 * Triggered when "Find" button is clicked
 */
function searchBtn() {

    // Get input value
    const input = document.querySelector("input");
    searchTerm = input.value;

    // Push current hour
    futureTime.push(currentHour);

    // Generate next 6 hours
    let hour = currentHour + 1;
    for (let i = 0; i < 6; i++) {
        futureTime.push(hour);
        hour++;
    }

    console.log(futureTime);

    // Fetch coordinates
    getLongAndLat();
}

/**
 * Fetch longitude, latitude, and timezone
 */
async function getLongAndLat() {
    try {
        document.getElementById("find").disabled = true;
        loader.classList.remove("hidden");

        console.log("Searching...");

        const apikey = "4926c30388d04b78974d2558e158896b",
            isSearching = true; // local shadowing (kept)

        const url = new URL("https://api.geoapify.com/v1/geocode/search?");
        url.searchParams.set("text", searchTerm);
        url.searchParams.set("apiKey", apikey);

        const call = await fetch(url);

        if (!call.ok) {
            throw new Error(`${call.status} Something went wrong with geoapify`);
        }

        const data = await call.json();

        long = data.features[0].properties.lon;
        lat = data.features[0].properties.lat;
        timeZone = data.features[0].properties.timezone.abbreviation_STD;

        console.log(
            "Found long, lat & timezone",
            long,
            lat,
            timeZone
        );

        // Fetch weather data
        getData();
    } catch (err) {
        console.log(err);
    } finally {
        // Reset search term
        searchTerm = "";
    }
}

/**
 * Fetch weather forecast data
 */
async function getData() {
    try {
        let tempNow;
        let tempArray; // unused (kept)

        let currentTemp = document.querySelector("#todayTemp");

        console.log("Finding data...");

        const url = new URL("https://api.open-meteo.com/v1/forecast?");
        url.searchParams.set("latitude", lat);
        url.searchParams.set("longitude", long);
        url.searchParams.set("timezone", timeZone);
        url.searchParams.set("current", "temperature_2m");
        url.searchParams.set("hourly", "temperature_2m");

        console.log(url);

        const call = await fetch(url);

        if (!call.ok) {
            throw new Error(`${call.status} Something went wrong with open-meteo`);
        }

        const data = await call.json();

        // Current temperature
        tempNow = data.current.temperature_2m;
        currentTemp.innerHTML = `${tempNow}&deg;C`;

        // Format future hours into AM/PM
        hoursFormated = futureTime.map(f => {
            let period = f <= 11 ? "AM" : "PM";
            let hour12 = f = f % 12 || 12;
            return hour12 + " " + period;
        });

        // Populate hourly temperatures
        document.getElementById("hour1").innerText = data.hourly.temperature_2m[futureTime[0]];
        document.getElementById("hour2").innerText = data.hourly.temperature_2m[futureTime[1]];
        document.getElementById("hour3").innerText = data.hourly.temperature_2m[futureTime[2]];
        document.getElementById("hour4").innerText = data.hourly.temperature_2m[futureTime[3]];
        document.getElementById("hour5").innerText = data.hourly.temperature_2m[futureTime[4]];
        document.getElementById("hour6").innerText = data.hourly.temperature_2m[futureTime[5]];

        // Populate date and time
        document.getElementById("todayDate").innerText =
            `${currentDateA}/${currentMonth}/${currentYear}`;

        document.getElementById("todayDay").innerText =
            Weekday[currentDay];

        document.getElementById("todayTime").innerText = hoursFormated[0];

        document.getElementById("hour1Time").innerText = hoursFormated[1];
        document.getElementById("hour2Time").innerText = hoursFormated[2];
        document.getElementById("hour3Time").innerText = hoursFormated[3];
        document.getElementById("hour4Time").innerText = hoursFormated[4];
        document.getElementById("hour5Time").innerText = hoursFormated[5];
        document.getElementById("hour6Time").innerText = hoursFormated[6];

    } catch (err) {
        console.log(err);
    } finally {
        console.log("Search complete");

        isSearching = false;
        loader.classList.add("hidden");
        document.getElementById("find").disabled = false;
    }
}
