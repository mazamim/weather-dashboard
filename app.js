var APIKey = "74a890a0f12a5124adefffcd98b7cd98";
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
var currentGeo;
var currentCity;

$(window).on('load', function() {
 
//get current geo location using window.navigator function which will return coordinates objects
//using this another function will convert those to a city name using google api eg-geoToAddress(x,y) will get cityz
getGeoLocation()




for (i = 0; i < window.localStorage.length; i++) {
    key = window.localStorage.key(i);
    if (key.slice(-12) === "weather-data") {
      cityList.push(key.slice(0,key.indexOf('-')));
    }
}




//function to get geo location using 
 function getGeoLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position)=>{
        // loadIni(position.coords.latitude,position.coords.longitude)
        currentGeo=position
        geoToAddress(position.coords.latitude,position.coords.longitude)
        
    });
  } else { 
   alert("Geolocation is not supported by this browser."); 
  }
}


// change it to name

function geoToAddress(lat,lon){

  var url ='https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon+'&key=AIzaSyBi2s5puIfi0U5S0NRdR4NiprHdtQf2JFA'
 const fetchme= fetch(url)
  .then(function (response) {
    if (response.ok) {
     response.json().then(function (data) {
    if (data !=null){

      for (var i=0; i<data.results[0].address_components.length; i++) { 
        for (var b=0;b<data.results[0].address_components[i].types.length;b++){

          if (data.results[0].address_components[i].types[b] == "locality") { 
            //this is the object you are looking for 
            city= data.results[0].address_components[i]; 
         
            break; 
        } 


        }
        }
       
        h1Place.textContent=city.long_name + ' - ' +moment().format('MM/DD/YYYY')
        currentCity=city.long_name
        cityList.push(currentCity.toLowerCase())

        let uniqueCity = cityList.filter((c, index) => {
          return cityList.indexOf(c) === index;
      });
        createListCities(uniqueCity)
     
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

});



///////////////////////////////////////////////////////////////////////////////////////////////////////
//check wether you have address.. required to wait till google api recieved a results
//below functikon is just to wait.....
function getCurrentCity () {
  

  if (currentCity != null) {
   // console.log('i have city')

    loadIni(currentGeo.coords.latitude,currentGeo.coords.longitude)


  } else {
   // console.log('i need to wait')
    setTimeout(getCurrentCity, 300); // try again in 300 milliseconds
  }
}

getCurrentCity();

//this below function will recieve  coordinates as parameter 
// l check local storage if any data related to
//if found will load from there else l call api

  function loadIni(lat,lon){


var local= JSON.parse(localStorage.getItem(currentCity.toLowerCase()+"-weather-data"));
    // check from local storage
    //compare today's date and local storage saved date
    var date1 = moment.unix(moment().unix()).format("MM/DD/YYYY");

    //if condtion to avoid reading error
    if (local!=null)
    {
   
      var date2 = moment.unix(local.current.dt).format("MM/DD/YYYY");
  
    
    }
    if (local!=null && date1 === date2){
  
      // console.log("display data from Local Storage")
      alertify.message('Data from local storage');
           display(local)
           displayForecast(local.daily)
    }
  
    else{
  
    

  fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=minutely,hourly,alerts&units=metric&appid='+APIKey)
    .then(function (response) {
      if (response.ok) {
        alertify.success('Connected to Saver');
       response.json().then(function (data) {
     if (data !=null){

  
         
               display(data)
               displayForecast(data.daily)
              localStorage.setItem(currentCity.toLowerCase()+"-weather-data", JSON.stringify(data));
                 
          }
        });
  
      } else {
        alertify.error('Error message'+ response.statusText);
      }
    })
    .catch(function (error) {
      alertify.error('Unable to connect to weather API');
    });
  


    
    }
  




}
//function to display current weather 
function display(data){
  if (data!=null){

      const {current}=data
      // h1Place.textContent=

        temp.textContent=current.temp
        cDescription.textContent=current.weather[0].description
         humidity.textContent=current.humidity
         windy.textContent=current.wind_speed
       uv.textContent=current.uvi
  }

 }

//this function is to fet feo codes from address
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



  //forecast handle

  function displayForecast(fData){
  if(fData.length===8){
    fData= fData.slice(1, 6)


    fData.forEach((element)=>{
    
      const {dt,uvi,weather,temp,humidity}=element
     newdt= moment.unix(dt).format("DD/MM/YYYY")
      
     //remove previous elemnts
  
     //create elements
      createElements(newdt,temp.max,humidity,weather)

    })

  }

  }

// create elements cards
  function createElements(cardheader,temp,humidity,weather){


  //create elements
  const parentDiv =document.querySelector('#parentDiv')
  //

//   <div class="card text-white bg-primary mb-3" style="max-width: 8rem;">
const outerDiv=document.createElement('div')
    outerDiv.classList.add('card' ,'text-white', 'text-center','bg-primary' ,'mb-3','me-1')
   // outerDiv.setAttribute("style","max-width: 10rem;")
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

//////////////////////////////////////////////////////////////////////////////////////////////


  searchForm.addEventListener('submit', formSubmitHandler);

  
function formSubmitHandler(event) {
  event.preventDefault();
    removeElements()


  var cityname = cityInput.value.trim();

  if (cityname) {
    currentCity=cityname
  addressToGeoCode(cityname)



  h1Place.textContent=currentCity + ' - ' +moment().format('MM/DD/YYYY')

  cityList.push(currentCity)

  let uniqueCity = cityList.filter((c, index) => {
    return cityList.indexOf(c) === index;
});
  createListCities(uniqueCity)


 
  } else {
    alert('Please enter a city Name');
  }

  cityInput.value=''

};

// add citylist

function removeElements(){
  const element =document.querySelectorAll(".card")
Array.prototype.forEach.call( element, function( node ) {
  node.parentNode.removeChild( node );
});

const Listelements =document.querySelectorAll(".list-group-item")
Array.prototype.forEach.call( Listelements, function( node ) {
  node.parentNode.removeChild( node );
});
}



 function createListCities(cityListLocal){

  cityListLocal.forEach((element)=>{

    //  <li class="list-group-item d-flex justify-content-between align-items-center">
const li = document.createElement('li')
li.classList.add("list-group-item" ,"d-flex" ,"justify-content-between" ,"align-items-center")
citylistItem.appendChild(li)


const a =document.createElement('a')
li.appendChild(a)
a.textContent=element
//  <a>  A list item</a>
//    <span class="badge bg-primary rounded-pill">14</span>
const listSpan=document.createElement('span')
listSpan.classList.add('badge' ,'bg-primary' ,'rounded-pill')
li.appendChild(listSpan)
listSpan.innerHTML=' &deg;C';
//    </li>
  
    li.addEventListener('click',handleListClick)

    })


}

function handleListClick(event){
removeElements()

  var btnClicked = $(event.target);
  const tempcity=btnClicked.parent('li').prevObject[0].textContent
  city = tempcity.substr(0, tempcity.length - 3);
  currentCity=city
  addressToGeoCode(city)
  h1Place.textContent=currentCity + ' - ' +moment().format('MM/DD/YYYY')
  let uniqueCity = cityList.filter((c, index) => {
    return cityList.indexOf(c) === index;
});
  createListCities(uniqueCity)
}
