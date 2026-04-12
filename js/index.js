const apiKey = '61337b4eb24f4830a75191505262903';
const city = 'Austin';
// const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
document.addEventListener("DOMContentLoaded", () => {
    
    console.log("DOM fully loaded and parsed");

    let data 
    let container = document.getElementById("weather-container")
    let containertwo = document.getElementById("days")

    // const days = data.forecast.forecastday;

  //  const globalMin = Math.min(...days.map(d => d.day.mintemp_f));
  //  const globalMax = Math.max(...days.map(d => d.day.maxtemp_f));

fetch(url)
.then((response) => response.json())
.then((json)=> {
    console.log(json)
    data = json
    console.log(data)
    console.log(data.current.condition.text)
    console.log(data.current.air_quality)
    setAirQuality(data.current.air_quality["us-epa-index"])
    setAirQualityBar(data.current.air_quality["us-epa-index"])
    // setBackground(data.current.condition.text)
    // loadCurrent(data)
    setBackground("rainy")
    loadInfo(data)
})


fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Austin&days=1`)
.then((response) => response.json())
.then((json)=> {
    console.log(json)
    console.log(json.forecast.forecastday[0].hour)
    let forecasts = json.forecast.forecastday[0].hour
    forecasts.forEach((item)=> loadCurrent(item))

})


fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Austin&days=10`)
.then((response) => response.json())
.then((json)=> {
    console.log(json.forecast.forecastday)
    let days = json.forecast.forecastday
    days.forEach((day) => { 
      // createTempBar(day)
      loadDays(day)})
    
    

})



function setBackground(weather) {
    console.log(weather)
    const body = document.body

  
  body.className = ""

  if (weather.includes("rainy")) {
    body.classList.add("rainy")
  } 
  else if (weather.includes("Sunny") || weather.includes("Clear")) {
    body.classList.add("sunny")
  } 
  else if (weather.includes("Cloudy")) {
    body.classList.add("cloudy")
  } 
   else if (weather.includes("Overcast")) {
     body.classList.add("overcast")
    //  document.body.style.backgroundImage = "url('./js/images/overcast.jpg')";
    
   
  } 
  // else {
  //   body.classList.add("default")
  // }

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



function loadCurrent(data) {
  console.log(data)
  let hour = data.time.split(" ")[1].split(":")[0]%12 || 12
  let temper = Math.round(data.temp_f)
  let image = data.condition.icon
  console.log(hour)
   let card = document.createElement("div")
    card.className = "card"
    let icon = document.createElement("img")
    icon.src = image
    let time =  document.createElement("span")
    time.innerText = hour
    let temp = document.createElement("span")
    temp.innerText = temper + "°"
    card.appendChild(time)
    card.appendChild(icon)
    card.appendChild(temp)
    container.appendChild(card)
   
}


function loadDays(item) {
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
  // cardtwo.appendChild(rightwrap)
  cardtwo.appendChild(weekday)
  cardtwo.appendChild(icontwo)
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

  function setAirQualityBar(rating) {

  }


}








});