// User verification from login request

const User = require('./classes/user.js');

var userData = [
    new User("Super Admin", "superAdmin@example.com", "Super Admin"),
    new User("Group Admin", "groupAdmin@example.com", "Group Admin"),
    new User("Group Assis", "groupAssis@example.com", "Group Assis"),
    new User("John Smith", "john@example.com")
]

module.exports = function(req, res) {

    // Error status code for empty request body
    if (!req.body) {return res.sendStatus(400);}

    // Verify user
    let userRes = {};
    console.log("Verifying user...");
    for (let user of userData) {
        // If user valid, build response data
        if (req.body.username == user.username) {
            userRes = user;
            userRes.valid = true;
            break;
        }
    }

    if (userRes.valid) {console.log("Login success!");}
    else {console.log("Login failed. Username not found.");}

    res.send(userRes);
};