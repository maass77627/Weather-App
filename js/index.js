const apiKey = '61337b4eb24f4830a75191505262903';
const city = 'Austin';
const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

document.addEventListener("DOMContentLoaded", () => {
    
    console.log("DOM fully loaded and parsed");

    let data 

fetch(url)
.then((response) => response.json())
.then((json)=> {
    console.log(json)
    data = json
    console.log(data)
    console.log(data.current.condition.text)
    // setBackground(data.current.condition.text)
    setBackground("rainy")
})



function setBackground(weather) {
    console.log(weather)
    const body = document.body

  // remove all previous classes
  body.className = ""

  if (weather.includes("rainy")) {
    body.classList.add("rainy")
  } 
  else if (weather.includes("sunny") || weather.includes("Clear")) {
    body.classList.add("sunny")
  } 
  else if (weather.includes("cloudy")) {
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




});