const http = require("http");
const WebSocketServer = require("websocket").server
let connection = null;
const msgPack = require('msgpack');

const requestListener = function (req, res) {
    res.port = 8081;
    res.writeHead(200);
    res.end(JSON.stringify({"message": "Session Created"}));
};

const messagePackItem =  [
    "LSE:SBRY",
    "LSE:SBRY",
    0.12,
    0.1,
    0.18,
    "2021-07-21 15:34:35",
    "0.60",
    "0.66",
    0.8,
    0.22,
    5.46,
    3.3775,
    12698948,
    50,
    "167.12",
    "6",
    "2021-07-21 15:34:35",
    "357548112819147",
    "AT",
    "189.18",
    "91.55",
    "165.7632",
    "1",
    "O",
    "P",
    "T",
    "161.66",
    "P"
]
//create a raw http server (this will help us create the TCP which will then pass to the websocket to do the job)
const httpserver = http.createServer(requestListener)

//pass the httpserver object to the WebSocketServer library to do all the job, this class will override the req/res
const websocket = new WebSocketServer({
    "httpServer": httpserver
})


httpserver.listen(8081, () => console.log("My server is listening on port 8081"))


//when a legit websocket request comes listen to it and get the connection .. once you get a connection thats it!
websocket.on("request", request=> {

    connection = request.accept(null, request.origin)
    console.log(request)
    connection.on("open", () => console.log("Opened!!!"))
    connection.on("close", () => console.log("CLOSED!!!"))
    connection.on("message", message => {
        var sendToClient = msgPack.pack(messagePackItem)

        console.log(`Received message ${message.utf8Data}`)
        connection.send(sendToClient)
    })


    //use connection.send to send stuff to the client
    // sendevery5seconds();


})

// function sendevery5seconds(){
//
//     connection.send(`Message ${Math.random()}`);
//
//     setTimeout(sendevery5seconds, 5000);
//
//
// }


//client code
// let ws = new WebSocket("ws://localhost:8080");
// ws.onmessage = message => console.log(message.data);
// ws.send("Hello! I'm client")
