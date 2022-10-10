// Server Side Chat System

// For routing
var express = require("express");
var app = express();
var http = require("http").Server(app);

// Cross origin sharing to cater from port 4200 to 3000
var cors = require("cors");
app.use(cors());

// For parsing JSON data
var bodyParser = require("body-parser");
app.use(bodyParser.json());

// MongoDB Client
var MongoClient = require("mongodb").MongoClient;
var objectID = require("mongodb").ObjectId; // For ObjectID functionality

// Point static path to serve Angular app
app.use(express.static(__dirname + "/../dist/chat-system/"));

// Start server in port 3000
const PORT = 3000;

// Connect to MongoClient
const URL = "mongodb://localhost:27017";
MongoClient.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {

    if (err) {return console.log(err);}

    // Connect to database
    const db = client.db("chat-db");
    if (db) {console.log("Successfully connected to database.");}

    // Import routes
    require("./routes/login.js")(db, app);
    require("./routes/getUserByName.js")(db, app);
    require("./routes/getUserByID.js")(db, app, objectID);
    require("./routes/getList.js")(db, app);
    require("./routes/getItem.js")(db, app, objectID);
    require("./routes/create.js")(db, app);
    require("./routes/delete.js")(db, app, objectID);
    require("./routes/update.js")(db, app, objectID);

    // Start server
    app.listen(PORT, () => {
        console.log("Server is listening on port: ", PORT);
    });

    // module.exports = app;
});

// var server = app.listen(PORT, function() {
//     console.log("Server is listening on port: " + server.address().port);
// });

/* ----- Route ----- */
// For login request
// app.post("/login", require("./login"));