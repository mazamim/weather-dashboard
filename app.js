var APIKey = "74a890a0f12a5124adefffcd98b7cd98";
var isLoadedCity=false;
var h1Place = document.querySelector("#place")
var temp = document.querySelector("#temp")
var humidity = document.querySelector("#humidity")
var windy = document.querySelector("#wind")
var uv = document.querySelector("#uv")

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
      const {current}=data
      // h1Place.textContent=
        temp.textContent=current.temp
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
   response.json().then(function (data) {
  if (data !=null){

    geo = data.results[0].geometry.location
     
      }   
    });
  } else {
    alert('Error: ' + response.statusText);
  }
})
.catch(function (error) {
  alert('Unable to connect to google API');
});

return geo
 
}

 function geoToAddress(lat,lon){
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
        h1Place.textContent=city.long_name
    
      
       
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
      console.log(element)
      const {dt,uvi,weather,temp,humidity}=element
     newdt= moment.unix(dt).format("DD/MM/YYYY")
      //create elements
      createElements(newdt,temp.max,humidity,weather)

    })

  }

  }


  function createElements(cardheader,temp,humidity,weather){


  //create elements
  const parentDiv =document.querySelector('#parentDiv')
  const outerDiv=document.createElement('div')
  outerDiv.classList.add('card' ,'text-white' ,'bg-primary' ,'mb-3')
  outerDiv.setAttribute("style","max-width: 10rem;")

  const cardHeader=document.createElement('div')
  cardHeader.classList.add('card-header')

  const cardBody=document.createElement('div')
  cardBody.classList.add('card-body')

  const innerH5=document.createElement('h5')
  innerH5.classList.add('card-title')
  const iclass=document.createElement('i')
  const ispanDes=document.createElement('span')
  ispanDes.setAttribute('style','font-size:0.8em;')
  
  
 

  const innerTempP=document.createElement('p')
  innerTempP.classList.add('card-text')
  const innerSpanTemp=document.createElement("span")
  innerSpanTemp.setAttribute('style','font-size:0.8em;')
  ispanDes.setAttribute("style","color:#f9d71c; font-size:0.8rem")

  const innerHumidityP=document.createElement('p')
  innerHumidityP.classList.add('card-text')
  innerHumidityP.setAttribute('style','font-size:0.8em;')

  // required style

//   <div class="card text-white bg-primary mb-3" style="max-width: 8rem;">
//   <div class="card-header">25/12/2021</div>
//   <div class="card-body">
//     <h5 class="card-title"><i class="fa fa-sun-o" aria-hidden="true"></i></h5>
//     <p class="card-text">Temp: <span>86.84</span>&#8451;</p>
//     <p class="card-text">Humidity: <span>43%</span></p>
//   </div>
// </div>

parentDiv.appendChild(outerDiv);
outerDiv.appendChild(cardHeader);
outerDiv.appendChild(cardBody);
      
cardBody.appendChild(innerH5);
innerH5.appendChild(iclass);
iclass.appendChild(ispanDes);
cardBody.appendChild(innerTempP);
  innerTempP.appendChild(innerSpanTemp)    
cardBody.appendChild(innerHumidityP);

cardHeader.textContent=cardheader
innerSpanTemp.innerHTML='Temp : '+temp+' &deg;C';
innerHumidityP.innerHTML='Humidity : '+humidity+ '%'
if(weather[0].description==='clear sky'){
  iclass.classList.add('fa','fa-certificate')
  iclass.setAttribute("style","color:#f9d71c;")
  ispanDes.textContent=' clear sky'
 
}

if(weather[0].description==='few clouds'){
  iclass.classList.add('fa','fa-cloud-download')
  iclass.setAttribute("style","color:#231F20;")
  ispanDes.textContent=' few clouds'

}

if(weather[0].description==='overcast clouds'){
  iclass.classList.add('fa','fa-cloud-upload')
  iclass.setAttribute("style","color:#231F20;")
  ispanDes.textContent=' overcast clouds'

}

if(weather[0].description==='drizzle'){
  iclass.classList.add('fa','fa-spinner')
  iclass.setAttribute("style","color:#f9d71c;")
  ispanDes.textContent=' drizzle'
}

if(weather[0].description==='rain'){
  iclass.classList.add('fa','fa-umbrella')
  iclass.setAttribute("style","color:#f9d71c;")
  ispanDes.textContent=' rain'
}

if(weather[0].description==='shower rain'){
  iclass.classList.add('fa','fa-shower')
  iclass.setAttribute("style","color:#f9d71c;")
  ispanDes.textContent=' shower rain'
}

if(weather[0].description==='thunderstorm'){
  iclass.classList.add('fa','fa fa-bolt')
  iclass.setAttribute("style","color:#f9d71c;")
  ispanDes.textContent=' thunderstorm'
}

if(weather[0].description==='snow'){
  iclass.classList.add('fa','fa-snowflake-o')
  iclass.setAttribute("style","color:#f9d71c;")
  ispanDes.textContent=' snow'
}

if(weather[0].description==='mist'){
  iclass.classList.add('fa','fa-bath')
  iclass.setAttribute("style","color:#f9d71c;")
  ispanDes.textContent=' mist'
}

  }

