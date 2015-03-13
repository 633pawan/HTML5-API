window.onload = init;

function init() {
	var sendButton = document.getElementById("sendButton");
	sendButton.onclick = send;
}

function send(e) {
	
	//clear click
	e.target.onclick = null;
	var ws = new WebSocket("ws://localhost:8181/broadcast");
	
	var sendToServer = function()
	{
		var msg = {
			lat: Math.random()/100,
			lon: Math.random()/100,
		};
		ws.send(JSON.stringify(msg));
	};
	
	ws.onopen = function()
     {
        // Web Socket is connected, send data using send()
        setInterval(sendToServer,5000);
        log("Open");
     };
     
     ws.onmessage = function (evt) 
     { 
        var msg = JSON.parse(evt.data);
        log("Received: Lat:"+msg.lat+" Lon:"+msg.lon);
        
     };
     ws.onclose = function()
     { 
        // websocket is closed.
        alert("Connection is closed..."); 
     };
}

function log(m)
{
	var div = document.getElementById("status");
	div.innerHTML = div.innerHTML + '<p>' + m + '</p>';
}

























