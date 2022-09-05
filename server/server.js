// Server Side Chat System

// For routing
var express = require("express");
var app = express();

// Cross origin sharing to cater from port 4200 to 3000
var cors = require("cors");
app.use(cors());

// For parsing JSON data
var bodyParser = require("body-parser");
app.use(bodyParser.json());

// Point static path to serve Angular app
app.use(express.static(__dirname + "/../dist/chat-system/"));

// Start server in port 3000
const PORT = 3000;
var server = app.listen(PORT, function() {
    console.log("Server is listening on port: " + server.address().port);
});

/* ----- Route ----- */
// For login request
app.post("/login", require("./login"));