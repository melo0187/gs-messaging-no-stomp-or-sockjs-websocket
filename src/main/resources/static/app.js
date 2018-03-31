//var stompClient = null;
var sock = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    /*if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");*/
}

function connect() {
    /*var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function (greeting) {
            showGreeting(JSON.parse(greeting.body).content);
        });
    });*/
    sock = new WebSocket('ws://localhost:8080/vehicleData');

    // Connection opened
    sock.addEventListener('open', function (event) {
        setConnected(true);
    });

    // Connection closed
    sock.addEventListener('close', function () {
        setConnected(false);
    });

    // Listen for messages
    sock.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        showGreeting(event.data);
    });

    /*sock.onmessage = function(e) {
        console.log('message', e.data);
    }*/
}

function disconnect() {
    /*if (stompClient !== null) {
        stompClient.disconnect();
    }*/
    if (sock !== null) {
        sock.close();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    //stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val()}));
    sock.send($("#name").val());
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});

