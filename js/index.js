const apiKey = '61337b4eb24f4830a75191505262903';
let city = 'Austin';
// const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
document.addEventListener("DOMContentLoaded", () => {
    loadWeather(city)
    renderCities()
    console.log("DOM fully loaded and parsed");


    document.getElementById("search-btn").addEventListener("click", () => {
      const input = document.getElementById("city-input").value
      city = input
      loadWeather(city)
     })

     document.getElementById("save-city").addEventListener("click", () => {
  let cities = JSON.parse(localStorage.getItem("cities")) || []

  if (!cities.includes(city)) {
    cities.push(city)
    localStorage.setItem("cities", JSON.stringify(cities))
    renderCities()
  }
})


     let panel = document.getElementById("city-panel")

document.getElementById("list-button").addEventListener("click", () => {
  panel.classList.remove("hidden")
  console.log("list button clicked")
})

document.getElementById("close-panel").addEventListener("click", () => {
  panel.classList.add("hidden")
})

    // let button = document.getElementById("list-button")
    // button.addEventListener("click", )

    let feels_like = document.getElementById("feels-like")
    let uv_index = document.getElementById("uv-index")
    
    const map = L.map('map').setView([30.2672, -97.7431], 6)
    // map.setView([data.location.lat, data.location.lon], 6)

   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19
  }).addTo(map)

  
  function getCurrentUTCDateHour() {
    const now = new Date()

    now.setUTCHours(now.getUTCHours() - 1)
    const yyyy = now.getUTCFullYear()
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0")
    const dd = String(now.getUTCDate()).padStart(2, "0")
    const hh = String(now.getUTCHours()).padStart(2, "0")
    return `${yyyy}${mm}${dd}${hh}`
  }

   const timestamp = getCurrentUTCDateHour()
  
  L.tileLayer(
    `https://weathermaps.weatherapi.com/precip/tiles/${timestamp}/{z}/{x}/{y}.png`,
    {
      opacity: 0.6, 
      maxZoom: 10,
      minZoom: 3
    }
  ).addTo(map)


    let data 
    let container = document.getElementById("weather-container")
    let containertwo = document.getElementById("days")

    

  function loadWeather(city){
// fetch(url)
// fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`)
fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=yes`)
.then((response) => response.json())
.then((json)=> {
    console.log(json)
    
    data = json

    map.setView([data.location.lat, data.location.lon], 6)
    console.log(data)
    console.log(data.current.condition.text)
    console.log(data.current.air_quality)
    setAirQuality(data.current.air_quality["us-epa-index"])
    feels_like.textContent = data.current.feelslike_f + "°"
    uv_index.textContent = data.current.uv
    // setAirQualityBar(data.current.air_quality["us-epa-index"])
    // setBackground(data.current.condition.text)
    // loadCurrent(data)
    setWind(data.current)
    setBackground(data.current.condition.text)
    loadInfo(data)

    container.innerHTML = ""
    containertwo.innerHTML = ""

    let days = data.forecast.forecastday
      days.forEach((day) => loadDays(day))

    
  
let currentHour = new Date().getHours()

let todayHours = data.forecast.forecastday[0].hour.slice(currentHour)
let tomorrowHours = data.forecast.forecastday[1].hour

let allHours = [...todayHours, ...tomorrowHours]

allHours.slice(0, 24).forEach((item, index) => {
  loadCurrent(item, index)
})

})
   }


// fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Austin&days=1`)
// .then((response) => response.json())
// .then((json)=> {
//     console.log(json)
//     console.log(json.forecast.forecastday[0].hour)
//     let forecasts = json.forecast.forecastday[0].hour
//     forecasts.forEach((item)=> loadCurrent(item))

// })


// fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Austin&days=10`)
// .then((response) => response.json())
// .then((json)=> {
//   console.log(json.forecast.forecastday.length)
//     console.log(json.forecast.forecastday)
//     let days = json.forecast.forecastday
//     days.forEach((day) => { 
//       // createTempBar(day)
//       loadDays(day)})
    
    

// })



function setBackground(weather) {
    console.log(weather)
    const body = document.body

               const condition = weather.toLowerCase()
  body.className = ""

  if (condition.includes("rainy") || condition.includes("rain")) {
    body.classList.add("rainy")
  } 
  else if (condition.includes("sunny") || condition.includes("clear")) {
    body.classList.add("sunny")
  } 
  else if (condition.includes("cloudy")) {
    body.classList.add("cloudy")
  } 
   else if (condition.includes("overcast")) {
     body.classList.add("overcast")
    //  document.body.style.backgroundImage = "url('./js/images/overcast.jpg')";
    
   
  } 


}



function loadInfo(data) {
  // let div = document.getElementById("info")
  let location = data.location.name
  let temp = data.current.temp_f
  let weather = data.current.condition.text
  let highlow = data.current.feelslike_f
  let h1 = document.getElementById("temp")
  h1.innerText = temp + "°"
  let h4 = document.getElementById("location")
  h4.innerText = location
  let sp = document.getElementById("weather")
  sp.innerText = weather
  let hi = document.getElementById("highlow")
  hi.innerText = "feels like:" + highlow
  // div.appendChild()
}






function loadCurrent(data, index) {
  let fullTime = data.time.split(" ")[1]
  let hour24 = parseInt(fullTime.split(":")[0])

  let ampm = hour24 >= 12 ? "PM" : "AM"
  let hour12 = hour24 % 12 || 12

  let temper = Math.round(data.temp_f)
  let image = data.condition.icon

  let card = document.createElement("div")
  card.className = "card"

  let icon = document.createElement("img")
  icon.src = image

  let time = document.createElement("span")

   
  if (index === 0) {
    time.innerText = "Now"
  } else {
    time.innerText = `${hour12} ${ampm}`
  }

  let temp = document.createElement("span")
  temp.innerText = temper + "°"

  card.appendChild(time)
  card.appendChild(icon)
  card.appendChild(temp)

  container.appendChild(card)
}




function loadDays(item) {
  console.log(item)
  console.log(item.date)
  console.log(new Date().toLocaleDateString().split("/").join("-"))
  const today = new Date(item.date).toLocaleDateString("en-US", {
  weekday: "short"
});
  console.log(today)

  // let wrapper = document.createElement("div")
  // wrapper.className = "wrap"
  let min = item.day.mintemp_f
  let max = item.day.maxtemp_f
  let span = document.createElement("span")
  span.className = "span"
  let spantwo = document.createElement("span")
  span.innerText = min + "°"
  spantwo.innerText = max + "°"

  let chanceOf = document.createElement("span")
  chanceOf.textContent = item.day.daily_chance_of_rain + "%"
   let wrap = document.createElement("div")
   wrap.className = "day-wrap"

  let cardtwo = document.createElement("div")
  cardtwo.className = "cardtwo"
  let weekday = document.createElement("h1")
  weekday.innerText = today
  let icontwo = document.createElement("img")
  icontwo.src = item.day.condition.icon
  let bar = document.createElement("div")
  bar.className = "temp-bar"
  let range = document.createElement("div")
  range.className = "temp-range"

  let rightwrap = document.createElement("div")
  rightwrap.className = "rightwrap"
  // wrapper.appendChild(span)
  // bar.appendChild(wrapper)
  //  bar.appendChild(span)
  bar.appendChild(range)
  rightwrap.appendChild(span)
  rightwrap.appendChild(bar)
  rightwrap.appendChild(spantwo)
  wrap.appendChild(icontwo)
  wrap.appendChild(chanceOf)
  // cardtwo.appendChild(rightwrap)
  cardtwo.appendChild(weekday)
  // cardtwo.appendChild(icontwo)
  cardtwo.appendChild(wrap)
  cardtwo.appendChild(rightwrap)
  // cardtwo.appendChild(spantwo)
  // cardtwo.appendChild(bar)
  // cardtwo.appendChild(span)
  
  containertwo.appendChild(cardtwo)
  
}

// function createTempBar(item) {
//   console.log(item.day.mintemp_f)
//   console.log(item.day.maxtemp_f)
//   let min = item.day.mintemp_f
//   let max = item.day.maxtemp_f
//   let span = document.createElement("span")
//   let spantwo = document.createElement("span")
//   span.innerText = min + "°"
//   spantwo.innerText = max + "°"

//   let bar = document.createElement("div")
//   bar.className = "temp-bar"
//   let range = document.createElement("div")
//   range.className = "temp-range"

// }

function setAirQuality(rating) {
  console.log(rating)
  let h1 = document.getElementById("airquality-rating")
  h1.textContent = rating
  let h2 = document.getElementById("airquality-word")
  let p = document.getElementById("airquality-description")
  p.textContent = `Air quality index is ${rating}`
  switch(rating) {
    case 1:
    h2.textContent = "Good"
    break
    case 2:
      h2.textContent = "Moderate"
      break
      case 3: 
       h2.textContent = "Unhealthy (Sensitive)"
       break
       case 4: 
        h2.textContent = "Unhealthy"
        break
        case 5:
        h2.textContent = "Very Unhealthy"
        break
        case 6: 
       h2.textContent = "Hazardous"
         break

  }

 


}


 function setAirQualityBar(rating) {
  console.log(rating)
  }

  function setWind(data) {
    console.log(data)
    let mph = document.getElementById("mph")
    mph.textContent = data.wind_mph + "mph"
    let gusts = document.getElementById("gusts")
    gusts.textContent = data.gust_mph + "mph"
    let dir = document.getElementById("dir")
    dir.textContent = data.wind_dir
    let arrow = document.getElementById("wind-arrow")
  arrow.style.transform = `rotate(${data.wind_degree}deg)`

  }



//   function renderCities() {
//   const list = document.getElementById("panel-city-list")
//   list.innerHTML = ""

//    let panel = document.getElementById("city-panel") 

//   let cities = JSON.parse(localStorage.getItem("cities")) || []

//   cities.forEach((c) => {
//     let div = document.createElement("div")
//     div.className = "city-item"
//     div.textContent = c

//     div.addEventListener("click", () => {
//       city = c
//       loadWeather(city)
//       panel.classList.add("hidden") // close after click
//     })

//     list.appendChild(div)
//   })
// }


function renderCities() {
  const list = document.getElementById("panel-city-list")
  list.innerHTML = ""

  let panel = document.getElementById("city-panel")
  let cities = JSON.parse(localStorage.getItem("cities")) || []

  cities.forEach((c) => {
    let div = document.createElement("div")
    div.className = "city-item"

    let name = document.createElement("span")
    name.textContent = c

    let deleteBtn = document.createElement("button")
    deleteBtn.textContent = "✕"
    deleteBtn.className = "delete-btn"

    // 🔴 delete logic
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation() // prevents triggering city click

      let updated = cities.filter(cityName => cityName !== c)
      localStorage.setItem("cities", JSON.stringify(updated))

      renderCities()
    })

    // click to load city
    div.addEventListener("click", () => {
      city = c
      loadWeather(city)
      panel.classList.add("hidden")
    })

    div.appendChild(name)
    div.appendChild(deleteBtn)

    list.appendChild(div)
  })
}






});