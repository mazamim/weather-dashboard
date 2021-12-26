

var APIKey = "74a890a0f12a5124adefffcd98b7cd98";

//var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
//var url='http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon + "&appid=" + APIKey

var h1Place = document.querySelector("#place")
var temp = document.querySelector("#temp")
var humidity = document.querySelector("#humidity")
var windy = document.querySelector("#wind")
var uv = document.querySelector("#uv")

var places=["London","Colombo","Kandy"]

getGeoLocation()


$("#search").autocomplete({
  source: places
})


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

  geoToAddress(lat,lon)

  var data=[]  
  for (let index = 0; index < 5; index++) {
    var local= JSON.parse(localStorage.getItem("weather-data-"+index));
    if(local !=null){
       data.push(local);
    }
   
    
  }


  // check from local storage
  //compare today's date and local storage saved date
  var date1 = moment.unix(moment().unix()).format("MM/DD/YYYY");

  //if condtion to avoid reading error
  if (data.length>0)
  {
 
    var date2 = moment.unix(data[0].current.dt).format("MM/DD/YYYY");
  }

  



  if (data.length>0 && date1 === date2){

    console.log("display data from Local Storage")
        display(data)
  }

  else{

    console.log("display data from server")
for (let index = 0; index < 5; index++) {
  var storageData=[]
  var todayDate=moment().subtract(index, 'days').unix()


 // http://api.openweathermap.org/data/2.5/onecall/timemachine?lat='+lat+'&lon='+lon+'&units=metric&dt='+todayDate+'&appid='+APIKey
  fetch('http://api.openweathermap.org/data/2.5/onecall/timemachine?lat='+lat+'&lon='+lon+'&units=metric&dt='+todayDate+'&appid='+APIKey)
  .then(function (response) {
    
    if (response.ok) {
     
      response.json().then(function (data) {
        console.log(data.current);
        if (data !=null){
        storageData.push(data)
       
        }


  
        localStorage.setItem("weather-data-"+index, JSON.stringify(data));
       
       
      });

      display(storageData)
    } else {
      alert('Error: ' + response.statusText);
    }
  })
  .catch(function (error) {
    alert('Unable to connect to weather API');
  });

  
}
  
  }


}

function display(data){
  if (data.length>0){
      const {current}=data[0]
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
  var geo;
  
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


