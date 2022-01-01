var APIKey = "74a890a0f12a5124adefffcd98b7cd98";
var isLoadedCity=false;
var h1Place = document.querySelector("#place")
var temp = document.querySelector("#temp")
var humidity = document.querySelector("#humidity")
var windy = document.querySelector("#wind")
var uv = document.querySelector("#uv")
var cDescription = document.querySelector("#c-description")

var searchForm = document.querySelector('#search-form');
var cityInput = document.querySelector('#cityInput');
var citylistItem = document.querySelector('#citylistItem');

var cityList=[]

//1
getGeoLocation()

function getGeoLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position)=>{
        loadIni(position.coords.latitude,position.coords.longitude)
        
    });
  } else { 
   alert("Geolocation is not supported by this browser."); 
  }
}

function loadIni(lat,lon){
   geoToAddress(lat, lon)
var local= JSON.parse(localStorage.getItem("weather-data"));
    // check from local storage
    //compare today's date and local storage saved date
    var date1 = moment.unix(moment().unix()).format("MM/DD/YYYY");

    //if condtion to avoid reading error
    if (local!=null)
    {
   
      var date2 = moment.unix(local.current.dt).format("MM/DD/YYYY");
      date2=''
    
    }
    if (local!=null && date1 === date2){
  
      console.log("display data from Local Storage")
          display(local)
          displayForecast(local.daily)
    }
  
    else{
  
      console.log("display data from server")

  fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly,alerts&units=metric&appid='+APIKey)
    .then(function (response) {
      if (response.ok) {
       response.json().then(function (data) {
     if (data !=null){
         
              display(data)
              displayForecast(data.daily)
              localStorage.setItem("weather-data", JSON.stringify(data));
          }
        });
  
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to weather API');
    });
  


    
    }
  




}

function display(data){
  if (data!=null){
    console.log(data)
      const {current}=data
      // h1Place.textContent=
      console.log(data.current)
        temp.textContent=current.temp
        cDescription.textContent=current.weather[0].description
         humidity.textContent=current.humidity
         windy.textContent=current.wind_speed
       uv.textContent=current.uvi
  }

 }


function addressToGeoCode(city){
var url ='https://maps.googleapis.com/maps/api/geocode/json?address='+city+'&key=AIzaSyBi2s5puIfi0U5S0NRdR4NiprHdtQf2JFA'
var geo;

fetch(url)
.then(function (response) {
  if (response.ok) {
   response.json().then( function (data) {
  if (data !=null){

    geo = data.results[0].geometry.location
 
    loadIni(geo.lat,geo.lng)


   // geoToAddress()
  
  

      }   
    });
  } else {
    alert('Error: ' + response.statusText);
  }
})
.catch(function (error) {
  alert('Unable to connect to google API');
});


 
}

  function geoToAddress(lat,lon){
   console.log(lat+" "+ lon)
  var url ='https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon+'&key=AIzaSyBi2s5puIfi0U5S0NRdR4NiprHdtQf2JFA'
 fetch(url)
  .then(function (response) {
    if (response.ok) {
     response.json().then(function (data) {
    if (data !=null){

      for (var i=0; i<data.results[0].address_components.length; i++) { 
        for (var b=0;b<data.results[0].address_components[i].types.length;b++){

          if (data.results[0].address_components[i].types[b] == "locality") { 
            //this is the object you are looking for 
            city= data.results[0].address_components[i]; 
            isLoadedCity=true
            break; 
        } 


        }
        }
        console.log(city.long_name)
        h1Place.textContent=city.long_name + ' - ' +moment().format('Dd/M/yyyy')
        cityList.push(city.long_name)

        let uniqueCity = cityList.filter((c, index) => {
          return cityList.indexOf(c) === index;
      });
        createListCities(uniqueCity)
       console.log(uniqueCity)
        }   
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  })
  .catch(function (error) {
    alert('Unable to connect to google API');
  });
  

   
  }

  //forecast handle

  function displayForecast(fData){
  if(fData.length===8){
    fData= fData.slice(1, 6)


    fData.forEach((element)=>{
      // console.log(element)
      const {dt,uvi,weather,temp,humidity}=element
     newdt= moment.unix(dt).format("DD/MM/YYYY")
      
     //remove previous elemnts
  
     //create elements
      createElements(newdt,temp.max,humidity,weather)

    })

  }

  }


  function createElements(cardheader,temp,humidity,weather){


  //create elements
  const parentDiv =document.querySelector('#parentDiv')
  //

//   <div class="card text-white bg-primary mb-3" style="max-width: 8rem;">
const outerDiv=document.createElement('div')
    outerDiv.classList.add('card' ,'text-white' ,'bg-primary' ,'mb-3')
    outerDiv.setAttribute("style","max-width: 10rem;")
    parentDiv.appendChild(outerDiv);       
//   <div class="card-header">25/12/2021</div>
const cardHeader=document.createElement('div')
cardHeader.classList.add('card-header')
outerDiv.appendChild(cardHeader);
cardHeader.textContent=cardheader
//   <div class="card-body">
const cardBody=document.createElement('div')
cardBody.classList.add('card-body')
outerDiv.appendChild(cardBody);
//     <h5 class="card-title"></h5>
const innerH5=document.createElement('h5')
innerH5.classList.add('card-title')

//     <p class="card-text">Temp: <span>86.84</span>&#8451;</p>
const innerTempP=document.createElement('p')
innerTempP.classList.add('card-text')
cardBody.appendChild(innerTempP);
const innerSpanTemp=document.createElement("span")
innerSpanTemp.setAttribute('style','font-size:0.8em;')
innerSpanTemp.innerHTML='Temp : '+temp+' &deg;C';

//     <p class="card-text">Humidity: <span>43%</span></p>

const innerHumidityP=document.createElement('p')
innerHumidityP.classList.add('card-text')
innerHumidityP.setAttribute('style','font-size:0.8em;')
const ispanDes=document.createElement('span')
// ispanDes.setAttribute('style','font-size:0.8em;')
ispanDes.setAttribute("style","color:#f9d71c; font-size:0.8rem")
innerTempP.appendChild(innerSpanTemp)   
cardBody.appendChild(innerHumidityP);
innerHumidityP.innerHTML='Humidity : '+humidity+ '%'
//   </div>
// </div>


const img = document.createElement("img");
cardBody.appendChild(img)
  img.src = 'http://openweathermap.org/img/wn/'+weather[0].icon+'@2x.png';

 
  const description=document.createElement('p')
  description.classList.add('card-text')
  cardBody.appendChild(description)
  description.setAttribute('style','font-size:0.8em;')
  description.textContent=weather[0].description
  }

  searchForm.addEventListener('submit', formSubmitHandler);

  
function formSubmitHandler(event) {
  event.preventDefault();
  //remove cards
  //element.parentNode.removeChild(element);
const element =document.querySelectorAll(".card")
Array.prototype.forEach.call( element, function( node ) {
  node.parentNode.removeChild( node );
});

const Listelements =document.querySelectorAll(".list-group-item")
Array.prototype.forEach.call( Listelements, function( node ) {
  node.parentNode.removeChild( node );
});


var geo;
  var cityname = cityInput.value.trim();

  if (cityname) {
  geo= addressToGeoCode(cityname)

 
  } else {
    alert('Please enter a ');
  }

};

// add citylist





 function createListCities(cityListLocal){

  cityListLocal.forEach((element)=>{

    //  <li class="list-group-item d-flex justify-content-between align-items-center">
const li = document.createElement('li')
li.classList.add("list-group-item" ,"d-flex" ,"justify-content-between" ,"align-items-center")
citylistItem.appendChild(li)
li.textContent=element
//    A list item
//    <span class="badge bg-primary rounded-pill">14</span>
const listSpan=document.createElement('span')
listSpan.classList.add('badge' ,'bg-primary' ,'rounded-pill')
li.appendChild(listSpan)
listSpan.innerHTML=' &deg;C';
//    </li>
    
    })






 

}