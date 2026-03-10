const officeLat = 4.6413110
const officeLng = 101.1104088
const radius = 250

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxB-vw9QpqL0M3I0TCdub5_iV3og8RmD5sJTUKx327oJbdsY2Q1UonhqfgQyIifpsS_/exec"

let html5QrCode
let scanned = false

function startScanner(){

const name = document.getElementById("name").value

if(!name){
alert("Please enter your name")
return
}

document.getElementById("scanner").classList.remove("hidden")

html5QrCode = new Html5QrCode("reader")

Html5QrCode.getCameras().then(devices => {

let backCamera = devices[devices.length-1].id

html5QrCode.start(
backCamera,
{ fps:10, qrbox:250 },
(decodedText) => {

if(scanned) return

scanned = true

onScan(decodedText,name)

})

})

}

function onScan(qrText,name){

navigator.geolocation.getCurrentPosition(pos=>{

let lat = pos.coords.latitude
let lng = pos.coords.longitude

let dist = distance(lat,lng,officeLat,officeLng)

if(dist > radius){

alert("You are outside office location")
scanned = false
return

}

let map = "https://maps.google.com/?q="+lat+","+lng
let location = lat + "," + lng

let now = new Date()

let date = now.toLocaleDateString()
let time = now.toLocaleTimeString()

let hour = now.getHours()

let type = hour < 12 ? "Intime" : "Outtime"

html5QrCode.stop()

fetch(SCRIPT_URL,{

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

.then(()=>{

playBeep()
flashSuccess()

if(type === "Intime"){

showPopup("Attendance Recorded","Welcome!")

}else{

showPopup("Leave Recorded","See you tomorrow!")

}

})

})

}

/* popup animation */

function showPopup(title,msg){

const popup = document.createElement("div")

popup.innerHTML = `
<div class="success-overlay">
<div class="success-card">

<div class="success-icon">✔</div>

<h2>${title}</h2>

<p>${msg}</p>

</div>
</div>
`

document.body.appendChild(popup)

setTimeout(()=>{
popup.remove()
scanned = false
},2500)

}

/* beep sound */

function playBeep(){

const ctx = new (window.AudioContext || window.webkitAudioContext)()

const oscillator = ctx.createOscillator()
const gain = ctx.createGain()

oscillator.type = "sine"
oscillator.frequency.value = 880

oscillator.connect(gain)
gain.connect(ctx.destination)

oscillator.start()

setTimeout(()=>{
oscillator.stop()
ctx.close()
},150)

}

/* green flash */

function flashSuccess(){

const flash = document.createElement("div")

flash.className = "success-flash"

document.body.appendChild(flash)

setTimeout(()=>{
flash.remove()
},400)

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
