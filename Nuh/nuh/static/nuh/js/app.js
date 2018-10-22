
/**
 *
 * Retrieving csrftoken from cookies
 *
 */
// pull req 2 xD
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');




/**
 * On Click event:
 * target='#updateLocation'
 * Preventing the usual behavior of the target element.
 * Loading the current position from LocalStorage.
 * Updating user's current location to server.
 * And adjusting the ui.
 *
 */
try{
    document.getElementById('updateLocation').addEventListener('click',function(e){
        e.preventDefault();
        let position=loadFromLocalStorage('myCoords');
    	$.ajax({
    	url:'update_location',
    	dataType:'json',
        headers:{
    		'Access-Control-Allow-Origin':'*',
            'X-CSRFToken':csrftoken,
        },
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        data:$.param(position),
    	cors:true,
    	secure:true,
    	type:'POST',
    	success:function(response){
            document.getElementById('updateLocation').innerHTML=response[0] .message;
            document.getElementById('updateLocation').style.color='silver';
    	},
    	error:function(error){
            document.getElementById('updateLocation').innerHTML='Error';
            document.getElementById('updateLocation').style.color='silver';
        }
    	});
    });
}
catch{}

/*MODAL*/
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
try{
    btn.addEventListener('click',function(){
        modal.style.display="block";
    });
}
catch{}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/**
 * DOM event:
 * Preset all the form elements values to empty string.
 * username & password -> login form
 * id_username,..,is_password2 -> Register form
 */
document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('username').value='';
	document.getElementById('password').value='';
	document.getElementById('id_username').value='';
	document.getElementById('id_first_name').value='';
	document.getElementById('id_last_name').value='';
	document.getElementById('id_email').value='';
    document.getElementById('id_password').value='';
	document.getElementById('id_password2').value='';
});

/**
 * On click event:
 * target='#toggle_reg',
 * Toggle registration form.
 *
 */

document.getElementById('toggle_reg').addEventListener('click',(e)=>{
	$('#register-form').animate({
		height:"toggle"
	});
})

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
