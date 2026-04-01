const apiKey = '61337b4eb24f4830a75191505262903';
const city = 'Austin';
const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

document.addEventListener("DOMContentLoaded", () => {
    
    console.log("DOM fully loaded and parsed");

    let data 
    let container = document.getElementById("weather-container")

fetch(url)
.then((response) => response.json())
.then((json)=> {
    console.log(json)
    data = json
    console.log(data)
    console.log(data.current.condition.text)
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
  else {
    body.classList.add("default")
  }

}



function loadInfo(data) {
  // let div = document.getElementById("info")
  let location = data.location.name
  let temp = data.current.temp_f
  let weather = data.current.condition.text
  let highlow = data.current.feelslike_f
  let h1 = document.getElementById("temp")
  h1.innerText = temp
  let h4 = document.getElementById("location")
  h4.innerText = location
  let sp = document.getElementById("weather")
  sp.innerText = weather
  let hi = document.getElementById("highlow")
  hi.innerText = highlow
  // div.appendChild()
}



function loadCurrent(data) {
  console.log(data)
  let hour = data.time.split(" ")[1].split(":")[0]%12 || 12
  let temper = data.temp_f
  let image = data.condition.icon
  console.log(hour)
   let card = document.createElement("div")
    card.className = "card"
    let icon = document.createElement("img")
    icon.src = image
    let time =  document.createElement("span")
    time.innerText = hour
    let temp = document.createElement("span")
    temp.innerText = temper
    card.appendChild(time)
    card.appendChild(icon)
    card.appendChild(temp)
    container.appendChild(card)
   
}




});