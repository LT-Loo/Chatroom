// Server Side

// For routing
var express = require("express");
var app = express();
var http = require("http").Server(app);

// Cross origin sharing to cater from port 4200 to 3000
var cors = require("cors");
app.use(cors());

// Socket for chat communication
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});
const sockets = require('./socket.js'); 

// Data Parsing
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// MongoDB Client
var MongoClient = require("mongodb").MongoClient;
var objectID = require("mongodb").ObjectId; // For ObjectID functionality

// Image Upload
const formidable = require("formidable");
const path = require("path");
var fs = require("fs");

// Point static path to serve Angular app and access images
app.use(express.static(__dirname + "/../dist/chat-system/"));
app.use('/images', express.static(path.join(__dirname, "./images")));

// Start server in port 3000
const PORT = 3000;

// Connect to MongoClient
const URL = "mongodb://127.0.0.1:27017";
MongoClient.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {

    if (err) {return console.log(err);}

    // Connect to database
    const db = client.db("chat-db");
    if (db) {console.log("Successfully connected to database.");}

    // Import routes
    require("./routes/login.js")(db, app);
    require("./routes/register.js")(db, app);
    // require("./routes/getUserByName.js")(db, app);
    require("./routes/getUserByID.js")(db, app, objectID);
    require("./routes/getAll.js")(db, app);
    require("./routes/getList.js")(db, app);
    require("./routes/getItem.js")(db, app, objectID);
    require("./routes/create.js")(db, app, objectID);
    // require("./routes/delete.js")(db, app, objectID);
    require("./routes/deleteMany.js")(db, app);
    require("./routes/update.js")(db, app, objectID);
    // require("./routes/push.js")(db, app, objectID);
    require("./routes/upload.js")(db, app, formidable, fs, path, objectID);

    // Start socket to listen requests from frontend
    sockets.connect(io, PORT, db, objectID);

    // Start server
    http.listen(PORT, () => {
        console.log("Server is listening on port: ", PORT);
    });

});
