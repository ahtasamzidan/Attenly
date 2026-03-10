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

let date = new Date().toLocaleDateString()
let time = new Date().toLocaleTimeString()

fetch("https://script.google.com/macros/s/AKfycbygOybGfMswz5MoRuw3SyBaE8OZxcO5RW8LPiW-Kqz8xulVzU-_D4NOwyLUxj86b_TF/exec",{

method:"POST",

body:JSON.stringify({

name:name,
qr:qrText,
lat:lat,
lng:lng,
map:map,
date:date,
time:time

})

})

document.getElementById("success").classList.remove("hidden")

})

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
