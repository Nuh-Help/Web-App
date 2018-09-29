
let map;
let infoWindow;
let usersPosition;
let getHelpCoords=[];
let giveHelpCoords=[];
let markers=[];

let getAccommodationCoords=[];
let getFoodCoords=[];
let getClothesCoords=[];
let getMedicineCoords=[];
let getOtherCoords=[];

let giveAccommodationCoords=[];
let giveFoodCoords=[];
let giveClothesCoords=[];
let giveMedicineCoords=[];
let giveOtherCoords=[];

/**
 *
 * Callback function for the Google Maps API.
 * Renders the map, and calls getCurrentCoords(). See bellow.
 *
 */

function initMap() {
  let options={
    center:{lat:-34,lng:150},
    zoom:1
  };
  map = new google.maps.Map(document.getElementById('map'), options);
  infoWindow = new google.maps.InfoWindow;
  getCurrentCoords();
}


/* Geolocation API:Retrieving user's current whereabouts, saving them to local storage, and placing the marker. */
function getCurrentCoords(){
 if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function(position) {
       usersPosition = {
         lat: position.coords.latitude,
         lng: position.coords.longitude
       };
      placeMarker(usersPosition,'This is me!',map);
       try{
        localStorage.removeItem('myCoords');
       }
       catch{}
       localStorage.setItem('myCoords',JSON.stringify(usersPosition));
     }, function() {
         console.log('');
     });
   } else {
     // Browser doesn't support Geolocation
     console.log('Browser doesnt support Geolocation.');
   }
}

// Loading all MapNav events
function mapNav(){
  document.getElementById('getHelp').addEventListener('click',showGetButtons);
  document.getElementById('giveHelp').addEventListener('click',showGiveButtons);

  document.getElementById('giveAccommodation').addEventListener('click',getAccommodationMarkers);
  document.getElementById('giveFood').addEventListener('click',getFoodMarkers);
  document.getElementById('giveClothes').addEventListener('click',getClothesMarkers);
  document.getElementById('giveMedicine').addEventListener('click',getMedicineMarkers);
  document.getElementById('giveOther').addEventListener('click',getOtherMarkers);

  document.getElementById('getAccommodation').addEventListener('click',giveAccommodationMarkers);
  document.getElementById('getFood').addEventListener('click',giveFoodMarkers);
  document.getElementById('getClothes').addEventListener('click',giveClothesMarkers);
  document.getElementById('getMedicine').addEventListener('click',giveMedicineMarkers);
  document.getElementById('getOther').addEventListener('click',giveOtherMarkers);

  document.getElementById('clear').addEventListener('click',hideMarkersEvent);
  document.getElementById('worldView').addEventListener('click',(e)=>{
    map.setZoom(1);
  });

}
mapNav();

//Toggles between get and give help
function showGetButtons(){
  document.getElementById('getHelpButtons').style.display='block';
  document.getElementById('giveHelpButtons').style.display='none';
  hideMarkers();
  markers=[];
}

function showGiveButtons(){
  document.getElementById('getHelpButtons').style.display='none';
  document.getElementById('giveHelpButtons').style.display='block';
  hideMarkers();
  markers=[];
}

// Retrieves markers of all people that offer help
function getHelpMarkers(e){
  e=e ||window.event;
  hideMarkers();
  markers=[];
  handleAjaxRequestForAll('get_all_give_help',placeMarker,getHelpCoords);

  e.preventDefault();
}

// Retrieves positions of all people that need help
function giveHelpMarkers(e){
  e=e||window.event;
  hideMarkers();
  markers=[];
  handleAjaxRequestForAll('get_all_need_help',placeMarker,giveHelpCoords);
  e.preventDefault();
}

// Retrieves positions of all people that need Accommodation
function getAccommodationMarkers(){
  hideMarkers();
  markers=[];
  handleAjaxRequest('get_accommodation_need_help',placeMarker,getAccommodationCoords);
}

// Retrieves positions of all people that need Food
function getFoodMarkers(){
  hideMarkers();
  markers=[];
  handleAjaxRequest('get_food_need_help',placeMarker,getFoodCoords);
}

// Retrieves positions of all people that need Clothes
function getClothesMarkers(){
  hideMarkers();
  markers=[];
  handleAjaxRequest('get_clothes_need_help',placeMarker,getClothesCoords);
}

// Retrieves positions of all people that need Medicine
function getMedicineMarkers(){
  hideMarkers();
  markers=[];
  handleAjaxRequest('get_medicine_need_help',placeMarker,getMedicineCoords);
}

// Retrieves positions of all people that need something else
function getOtherMarkers(){
  hideMarkers();
  markers=[];
  handleAjaxRequest('get_other_need_help',placeMarker,getOtherCoords);
}

// Retrieves positions of all people that offer Accommodation
function giveAccommodationMarkers(){
  hideMarkers();
  markers=[];
  handleAjaxRequest('get_accommodation_give_help',placeMarker,giveAccommodationCoords);
}

// Retrieves positions of all people that offer Food
function giveFoodMarkers(){
  hideMarkers();
  markers=[];
  handleAjaxRequest('get_food_give_help',placeMarker,giveFoodCoords);
}

// Retrieves positions of all people that offer Clothes
function giveClothesMarkers(){
  hideMarkers();
  markers=[];
  handleAjaxRequest('get_clothes_give_help',placeMarker,giveClothesCoords);
}

// Retrieves positions of all people that offer Medicine
function giveMedicineMarkers(){
  hideMarkers();
  markers=[];
  handleAjaxRequest('get_medicine_give_help',placeMarker,giveMedicineCoords);
}

// Retrieves positions of all people that offer something else
function giveOtherMarkers(){
  hideMarkers();
  markers=[];
  handleAjaxRequest('get_other_give_help',placeMarker,giveOtherCoords);
}

// Ajax request to server for lat,lng,description and e-mail
// Takes 3 args:
// 1) url to a specified view that handles the corresponding request
// 2) callback function to be executed when the connection is made
// 3) array to store lat,lng coordinates
function handleAjaxRequest(url,callback,array){
     $.ajax({
                url: url,
                dataType:'json',
                cors:true,
                secure: true,
                headers:{
                  'Access-Control-Allow-Origin':'*',
                },
                contentType: 'application/json; charset=utf-8',
                type: 'GET',
                success: function(response) {
                  let arrEmail=[];
                  let arrinfo=[];
                  let i=0;
                  array=[];
                  currentCoords=[];
                  response[1].forEach((item)=>{
                    arrEmail.push(item);
                  });
                  response[2].forEach((item)=>{
                    arrinfo.push(item);
                  });
                  response[0].forEach(markerpos=>{
                    array.push({lat:parseFloat(markerpos[0]),lng:parseFloat(markerpos[1])});
                    currentCoords.push({lat:parseFloat(markerpos[0]),lng:parseFloat(markerpos[1])});
                    callback({lat:parseFloat(markerpos[0]),lng:parseFloat(markerpos[1])},`E-mail:${arrEmail[i]}<br> Info:${arrinfo[i]}`,map);
                    i++;
                  });
                  document.querySelector('#clear').innerHTML='Clear';
                },
                error: function(error) {
                    console.log(error.status);
                }
            });
  }

// Ajax request to server for lat,lng,description
// Takes 3 args:
// 1) url to a specified view that handles the corresponding request
// 2) callback function to be executed when the connection is made
// 3) array to store lat,lng coordinates
function handleAjaxRequestForAll(url,callback,array){
   $.ajax({
              url: url,
              dataType:'json',
              cors:true,
              secure: true,
              headers:{
                'Access-Control-Allow-Origin':'*',
              },
              contentType: 'application/json; charset=utf-8',
              type: 'GET',
              success: function(response) {
                let arrEmail=[];
                let i=0;
                array=[];
                currentCoords=[];
                response[1].forEach((item)=>{
                  arrEmail.push(item);
                });
                response[0].forEach(markerpos=>{
                  array.push({lat:parseFloat(markerpos[0]),lng:parseFloat(markerpos[1])});
                  currentCoords.push({lat:parseFloat(markerpos[0]),lng:parseFloat(markerpos[1])});
                  callback({lat:parseFloat(markerpos[0]),lng:parseFloat(markerpos[1])},`E-mail:${arrEmail[i]}`,map);
                  i++;
                });
              $('html,body').animate({
                scrollTop:$('#map').offset().top
              },1500);
              document.querySelector('#clear').innerHTML='Clear';
              },
              error: function(error) {
                  console.log(error.status);
              }
          });
}

/**
 *
 * A simple function that takes the key as an argument and retrieves the object from local storage
 * Args: (1) String key
 * return value: JSON response(key:value pairs) for a specified key
 *
 */
function loadFromLocalStorage(key){
  return JSON.parse(localStorage.getItem(key));
}

  /* Places a default marker on a specified position with a specified text */
function placeMarker(position,iWindowContent="Missing content", map) {
  var marker = new google.maps.Marker({
    position: position,
    map: map
  });
  google.maps.event.addListener(marker, 'click', function() {
    let iw=new google.maps.InfoWindow();
    iw.setContent(iWindowContent);
    iw.open(map, this);
  });
  map.panTo(position); //centers the map afterwards,not necessary
  markers.push(marker);
}

//Shows currently used markers
function showMarkers(){
  for(let i=0;i<markers.length;i++)
    markers[i].setMap(map);
}

// Hides currently used markers
function hideMarkers(){
  for(let i=0;i<markers.length;i++){
  markers[i].setMap(null);
  }
}

// Hides currently used markers
function hideMarkersEvent(event){
  if(event.target.innerHTML=="Clear"){
    for(let i=0;i<markers.length;i++)
      markers[i].setMap(null);
    event.target.innerHTML='Show';
  }
  else{
    for(let i=0;i<markers.length;i++)
      markers[i].setMap(map);
    event.target.innerHTML='Clear';
  }
}

