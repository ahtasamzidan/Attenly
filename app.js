let html5QrCode;

function startScanner(){

document.getElementById("scanner").classList.remove("hidden");

html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras().then(devices => {

let backCamera = devices[devices.length-1].id;

html5QrCode.start(
backCamera,
{ fps:10, qrbox:250 },
onScanSuccess
);

});

}

function onScanSuccess(decodedText){

navigator.geolocation.getCurrentPosition(function(pos){

let lat = pos.coords.latitude;
let lng = pos.coords.longitude;

let map="https://maps.google.com/?q="+lat+","+lng;

document.getElementById("status").innerHTML=
"QR: "+decodedText+
"<br>Location: "+lat+", "+lng+
"<br><a href='"+map+"' target='_blank'>Open Map</a>";

});

}
