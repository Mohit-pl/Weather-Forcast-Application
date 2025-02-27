// console.log("hello jee babber");

// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

// function renderWeatherInfo(data) {
//   let newPara = document.createElement("p");
//   newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;
//   document.body.appendChild(newPara);
// }

// async function fetchWeatherDetails() {
//   try {
//     // let latitude = 15.333;
//     // let longitutde = 74.0833;

//     let city = "goa";

//     const responce = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
//     );

//     const data = await responce.json();
//     console.log("weather data:->", data);

//     renderWeatherInfo(data);
//   } catch (error) {}
// }

// async function getCustomWeatherDetails() {
//   try {
//     let letitude = 28.7216;
//     let longitutde = 77.1579;

//     let result = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?lat=${letitude}&lon=${longitutde}&appid=${API_KEY}&units=metric`
//     );

//     let data = await result.json();
//     console.log(data);
//   } catch (error) {
//     console.log("Error Found", err);
//   }
// }

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPostion);
//   } else {
//     console.log("No geolocation Support");
//   }
// }

// function showPostion(position) {
//   let leti = position.coords.latitude;
//   let longi = position.coords.longitude;

//   console.log(leti);
//   console.log(longi);
// }

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(
  ".grand-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variable need???

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
  if (newTab != oldTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      //kya serach form wala container is invincible then make it visible.
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      //main phele search wale tab pr tha,ab your weather tab visible krna he
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //ab main your weather tab me aagya hu, toh weather bhi display karna padega,so let's check local storage first for coordinate,if we have saved them there.
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  //pass clicked tab as input parameter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  //pass clicked tab as input parameter
  switchTab(searchTab);
});

//check if corrdinate are already present in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates) {
      //agar local coordinates nahi mile
      grantAccessContainer.classList.add("active");
  }
  else {
      const coordinates = JSON.parse(localCoordinates);
      fetchUserWeatherInfo(coordinates);
  }

}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  //make grantcontainer invisible
  grantAccessContainer.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    console.log("Error Found", err);
  }
}

function renderWeatherInfo(weatherInfo) {
  //firstly, we have to fetch the element

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloud]");

  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = weatherInfo?.main?.temp;
  windSpeed.innerText = weatherInfo?.wind?.speed;
  humidity.innerText = weatherInfo?.main?.humidity;
  cloudiness.innerText = weatherInfo?.cloud?.all;
}

function getLocation() {
  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  }
  else {
      //HW - show an alert for no gelolocation support available
  }
}

function showPosition(position) {

  const userCoordinates = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
  }

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try{
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch{
    console.log('error');
  }
}