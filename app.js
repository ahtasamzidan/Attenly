const officeLat = 4.6413110
const officeLng = 101.1104088
const radius = 250

let html5QrCode

function startScanner(){

const name = document.getElementById("name").value

if(!name){
alert("Please enter your name")
return
}

document.getElementById("scanner").classList.remove("hidden")

html5QrCode = new Html5Qrcode("reader")

Html5Qrcode.getCameras().then(devices => {

let backCamera = devices[devices.length-1].id

html5QrCode.start(
backCamera,
{ fps:10, qrbox:250 },
text => onScan(text,name)
)

})

}

function onScan(qrText,name){

navigator.geolocation.getCurrentPosition(pos=>{

let lat = pos.coords.latitude
let lng = pos.coords.longitude

let dist = distance(lat,lng,officeLat,officeLng)

if(dist > radius){

alert("You are outside office location")
return

}

let map = "https://maps.google.com/?q="+lat+","+lng
let location = lat + "," + lng

let now = new Date()

let date = now.toLocaleDateString()
let time = now.toLocaleTimeString()

/* Detect morning or afternoon */

let hour = now.getHours()

let type

if(hour < 12){
type = "Intime"
}else{
type = "Outtime"
}

fetch("YOUR_SCRIPT_URL",{

method:"POST",

body:JSON.stringify({

name:name,
qr:qrText,
location:location,
map:map,
date:date,
time:time,
type:type

})

})

.then(res => res.text())
.then(msg => {

/* stop scanner */

html5QrCode.stop()

if(type == "Intime"){

showPopup(
"Attendance recorded successfully",
"Welcome!"
)

}else{

showPopup(
"Leave recorded successfully",
"See you tomorrow!"
)

}

})

})

}

/* popup animation */

function showPopup(title,subtitle){

const popup = document.createElement("div")

popup.innerHTML = `
<div style="
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,0.6);
display:flex;
align-items:center;
justify-content:center;
z-index:9999;
">

<div style="
background:white;
padding:30px;
border-radius:12px;
text-align:center;
max-width:300px;
font-family:sans-serif;
">

<h2 style="color:#16a34a">${title}</h2>
<p>${subtitle}</p>

</div>
</div>
`

document.body.appendChild(popup)

setTimeout(()=>{
popup.remove()
},3000)

}

/* distance calculation */

function distance(lat1, lon1, lat2, lon2){

const R = 6371e3

const φ1 = lat1*Math.PI/180
const φ2 = lat2*Math.PI/180

const Δφ = (lat2-lat1)*Math.PI/180
const Δλ = (lon2-lon1)*Math.PI/180

const a =
Math.sin(Δφ/2)*Math.sin(Δφ/2) +
Math.cos(φ1)*Math.cos(φ2) *
Math.sin(Δλ/2)*Math.sin(Δλ/2)

const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))

return R*c

}
