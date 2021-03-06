
let tog;	// OUR CHECKBOXES
let inp;
let dataBox;													// DATA GENERATED BY SERVER(OR IN THIS CASE DATA FROM myProfileData.json)
let dataInfo;
let simpleRes=document.querySelector('.simple-response');
let save;
let cancel;
let eMail;
let fullName;
let status=document.querySelector('#status');
let profile=document.querySelector('#profile');
let pmh=document.querySelector('#put-me-here');

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


document.addEventListener('DOMContentLoaded',loadToLocalStorage);
// Load
function loadToLocalStorage(){
	 $.ajax({
                    url: "myprofile",
                    dataType:'json',
                    cors:true,
                    secure: true,
                      headers:{
                        'Access-Control-Allow-Origin':'*',
                      },
                    contentType: 'application/json; charset=utf-8',
                    type: 'GET',
                    success: function(response) {
                        let checkBox={};
                        	for(let item in response[4]){
                        		if(item=='latitude'){
                        			localStorage.setItem('lat',JSON.stringify(response[4][item]));
                        		}
                        		else if(item=='longitude'){
                        			localStorage.setItem('lng',JSON.stringify(response[4][item]));
                        		}
                        		else if(response[4][item]==null)
                        			checkBox[item]=0;
                        		else{
                        			checkBox[item]=1;
                        			switch(item){
                        				case "get_food":document.querySelector('#current-asking-for').innerHTML+=' food,';
                        				break;
                        				case "get_accommodation":document.querySelector('#current-asking-for').innerHTML+=' accommodation,';
                        				break;
                        				case "get_clothes":document.querySelector('#current-asking-for').innerHTML+=' clothes,';
                        				break;
                        				case "get_medicine":document.querySelector('#current-asking-for').innerHTML+=' medicine,';
                        				break;
                        				case "get_other":document.querySelector('#current-asking-for').innerHTML+=' other.';
                        				break;
                        				case "give_food":document.querySelector('#current-offering').innerHTML+=' food,';
                        				break;
                        				case "give_accommodation":document.querySelector('#current-offering').innerHTML+=' accommodation,';
                        				break;
                        				case "give_clothes":document.querySelector('#current-offering').innerHTML+=' clothes,';
                        				break;
                        				case "give_medicine":document.querySelector('#current-offering').innerHTML+=' medicine,';
                        				break;
                        				case "give_other":document.querySelector('#current-offering').innerHTML+=' other.';
                        				break;
                        				default:
                        					console.log('');
                        					break;
                        			}
                        		}
                        	}


                    	localStorage.setItem('checkBox',JSON.stringify(checkBox));
                    	localStorage.setItem('myInfo',JSON.stringify(response[4]));
         			  	localStorage.setItem('fullName',JSON.stringify(response[1].first_name+' '+response[2].last_name));
         			  	localStorage.setItem('eMail',JSON.stringify(response[3].e_mail));
				    	document.querySelector('#fullName').innerHTML=response[1].first_name+' '+response[2].last_name;
    			       	document.querySelector('#eMail').innerHTML=response[3].e_mail;

		 			},
                    error: function(error) {
						console.log(error.statusText);
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

status.addEventListener('click',loadStatus);
profile.addEventListener('click',loadProfile);

// Dynamic load of users current status(activity) and profile

function loadStatus(e){
	load('status',addEventListenersForStatus);
	e.preventDefault();
}
function loadProfile(e){
	load('account_settings',addEventListenersForProfile);
	e.preventDefault();
}

// Ajax request for Dynamic loading of status and profile
function load(url,callback){
	$.ajax({
		url:url,
        dataType:'html',
        cors:true,
        secure: true,
        headers:{
            'Access-Control-Allow-Origin':'*',
        },
        type: 'GET',
        success: function(response) {
           	pmh.innerHTML=response;
           	callback();
        },
        error: function(error) {
			console.log(error.statusText);
        }
	});
}

// After successful load, add events to :
// 1) CheckBox's(event=change, callback=checkChange)
// 2) Save Button(event=click,callback=storeUpdatedCheckBox)
// 3) Cancel Button(event=click,callback=setCheckBox(i.e. returns to previously saved state))
function addEventListenersForStatus(){
	tog=document.getElementsByClassName('toggle__input');
	inp=document.getElementsByClassName('toggle__info');

	for(let i=0;i<tog.length;i++){
		tog[i].addEventListener('change',checkChange);
	}
	save=document.querySelector('#save');
	save.addEventListener('click',storeUpdatedCheckBox);
	cancel=document.querySelector('#cancel');
	cancel.addEventListener('click',setCheckBox);
	setCheckBox();
	document.getElementsByClassName('nav-link');


}

// After successful load of profile
// Add event listeners to:
// 1) #oldpassword
// 2) #newpassword
// 3) #newpassword-confirm
// 4) chgpw button(event=click,callback=validateAndChangePassword)
function addEventListenersForProfile(){
	document.querySelector('#oldpassword').addEventListener('keyup',(e)=>{
		if(document.querySelector('#oldpassword').value!='')
		document.querySelector('#newpassword').disabled=false;
		else{
		document.querySelector('#newpassword').disabled=true;
			}
	});
	document.querySelector('#newpassword').addEventListener('keyup',(e)=>{
		if(document.querySelector('#newpassword').value!='')
			document.querySelector('#newpassword-confirm').disabled=false;
		else
			document.querySelector('#newpassword-confirm').disabled=true;
	});
	document.querySelector('.fnm').innerHTML=loadFromLocalStorage('fullName');
	document.getElementById('staticEmail').value=loadFromLocalStorage('eMail');
	document.getElementById('chgpw').addEventListener('click',validateAndChangePassword);
}

// Checks if : 2 passwords are different, the old password is different from new one
// If both conditions are met
// Sends an ajax request to server
// To validate the new password and make the changes.
function validateAndChangePassword(e){
	let pws={};
	pws.old_password=document.querySelector('#oldpassword').value;
	pws.new_password=document.querySelector('#newpassword').value;
	newpassword1=document.querySelector('#newpassword-confirm').value;
	if (pws.new_password != newpassword1)
	{
	    simpleRes.style.opacity='1';
        simpleRes.style.zIndex='99';
		simpleRes.style.backgroundColor='red';
	    simpleRes.innerHTML='Your new password doesn\'t match with confirming password';
		$('.simple-response').animate({
			opacity:0
		},3000)
		setTimeout(function(){
			simpleRes.innerHTML='';
			simpleRes.style.zIndex='-1';
			simpleRes.style.backgroundColor='transparent';
		}, 3000);
	}else if(pws.new_password === pws.old_password){
        simpleRes.style.opacity='1';
        simpleRes.style.zIndex='99';
		simpleRes.style.backgroundColor='red';
	    simpleRes.innerHTML='Your new password must differ from the old one.'
		$('.simple-response').animate({
			opacity:0
		},3000)
		setTimeout(function(){
			simpleRes.innerHTML='';
			simpleRes.style.zIndex='-1';
			simpleRes.style.backgroundColor='transparent';
		}, 3000);
	}else{
	$.ajax({
		url:'change_password',
		dataType:'json',
        headers:{
            'Access-Control-Allow-Origin':'*',
       	    'X-CSRFToken':csrftoken,
        },
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        data:$.param(pws),
		cors:true,
		secure:true,
		type:'POST',
		success:function(response){
			if(response[0].message=='Successfully changed your password!'){
			    simpleRes.style.opacity='1';
	            simpleRes.style.zIndex='99';
				simpleRes.style.backgroundColor='lightgreen';
				simpleRes.innerHTML=`${response[0].message}`;
				$('.simple-response').animate({
					opacity:0
				},3000)
				setTimeout(function(){
					simpleRes.innerHTML='';
					simpleRes.style.zIndex='-1';
					simpleRes.style.backgroundColor='transparent';
				}, 3000);}
			else{
			    simpleRes.style.opacity='1';
	            simpleRes.style.zIndex='99';
				simpleRes.style.backgroundColor='red';
				simpleRes.innerHTML=`${response[0].message}`;
				$('.simple-response').animate({
					opacity:0
				},3000)
				setTimeout(function(){
					simpleRes.innerHTML='';
					simpleRes.style.zIndex='-1';
					simpleRes.style.backgroundColor='transparent';
				}, 3000);
			}
		},
		error:function(error){
			console.log(error);
		    simpleRes.style.opacity='1';
		    simpleRes.style.zIndex='99';
			simpleRes.style.backgroundColor='red';
			simpleRes.innerHTML='Error!';
			$('.simple-response').animate({
				opacity:0
			},3000)
			setTimeout(function(){
				simpleRes.innerHTML='';
				simpleRes.style.zIndex='-1';
				simpleRes.style.backgroundColor='transparent';
			}, 3000);
		}
	})};
	e.preventDefault();
}

// If checkBox is false -> Disable the textArea
// Else -> Enable it
function checkChange(e){
    console.log(e.target.nextElementSibling.nextElementSibling.nextElementSibling);
    let stateBeforeChange=e.target.nextElementSibling.nextElementSibling.nextElementSibling.disabled;
    e.target.nextElementSibling.nextElementSibling.nextElementSibling.disabled =! stateBeforeChange;
    if(stateBeforeChange==false)
        e.target.nextElementSibling.nextElementSibling.nextElementSibling.value='';
}

// Saves the changed data to localStorage
// and then returns the data to server
function storeUpdatedCheckBox(e){
	let i=0;
	for(let key in dataBox){
		if(tog[i].checked==true){
			dataBox[key]=1;
			dataInfo[key]=inp[i].value;
		}
		else{
			dataBox[key]=0;
			dataInfo[key]=null; //EDITED
		}
		i++;
	}
	localStorage.removeItem('checkBox');
	localStorage.setItem('checkBox',JSON.stringify(dataBox));
	localStorage.removeItem('myInfo');
	localStorage.setItem('myInfo',JSON.stringify(dataInfo));
	e.preventDefault();

		let cbx=loadFromLocalStorage('checkBox');
		let logicdata={};
		logicdata.does_nf=cbx.get_food;
		logicdata.does_na=cbx.get_accommodation;
		logicdata.does_nc=cbx.get_clothes;
		logicdata.does_nm=cbx.get_medicine;
		logicdata.does_no=cbx.get_other;
    	logicdata.does_gf=cbx.give_food;
		logicdata.does_ga=cbx.give_accommodation;
		logicdata.does_gc=cbx.give_clothes;
		logicdata.does_gm=cbx.give_medicine;
		logicdata.does_go=cbx.give_other;

		let rawdata=loadFromLocalStorage('myInfo');
		let dataToSend={};
		for(let key in rawdata){
			if(key=='latitude')
				break;
			else
				dataToSend[key]=rawdata[key];
		}
		dataToSend={...logicdata,...dataToSend};
		 respondToServer('save_checkboxes',dataToSend);
}


function respondToServer(url,data){
	$.ajax({
		url: url,
		dataType:'json',
		data:$.param(data),
		cors:true,
		secure: true,
		headers:{
			'Access-Control-Allow-Origin':'*',
			'X-CSRFToken':csrftoken,
		},
		contentType: 'application/x-www-form-urlencoded; charset=utf-8',
		type: 'POST',
		success: function(response) {
			if(response[0].message=='Success'){
	    		simpleRes.style.opacity='1';
				simpleRes.style.zIndex='99';
				simpleRes.style.backgroundColor='lightgreen';
				simpleRes.innerHTML=`${response[0].message}`;
				$('.simple-response').animate({
					opacity:0
				},3000)
				setTimeout(function(){
					simpleRes.innerHTML='';
					simpleRes.style.zIndex='-1';
					simpleRes.style.backgroundColor='transparent';
				}, 3000);
			}else{
				simpleRes.style.opacity='1';
				simpleRes.style.zIndex='99';
				simpleRes.style.backgroundColor='red';
				simpleRes.innerHTML=`${response[0].message}`;
				$('.simple-response').animate({
					opacity:0
				},3000)
			setTimeout(function(){
				simpleRes.innerHTML='';
				simpleRes.style.zIndex='-1';
				simpleRes.style.backgroundColor='transparent';
			}, 3000);
		}
		},
		error: function(error) {
			simpleRes.style.opacity='1';
			simpleRes.style.zIndex='99';
			simpleRes.style.backgroundColor='red';
			simpleRes.innerHTML='Error!';
			$('.simple-response').animate({
				opacity:0
			},3000)
			setTimeout(function(){
				simpleRes.innerHTML='';
				simpleRes.style.zIndex='-1';
				simpleRes.style.backgroundColor='transparent';
			}, 3000);
		}
	});
}

// Gets the data from localStorage(last known settings )
// And then on the value of that data
// Updates states of CheckBox's
function setCheckBox(e){
	dataBox=loadFromLocalStorage('checkBox');
	dataInfo=loadFromLocalStorage('myInfo');
	let checkBoxIndex=0;
	for(let key in dataBox){

		if(dataBox[key]==1){
		tog[checkBoxIndex].checked=true;
		inp[checkBoxIndex].disabled=false;
		inp[checkBoxIndex].value=dataInfo[key];

		}else{
			tog[checkBoxIndex].checked=false;
			inp[checkBoxIndex].value='';
		inp[checkBoxIndex].disabled=true;
		}
		checkBoxIndex++;
	}
	try{
		e.preventDefault();
	}
	catch{
	}
}


/* Dinamic load of form elements */

