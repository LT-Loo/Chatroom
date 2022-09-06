// User verification from login request

const User = require('./classes/user.js');

// Read data from JSON file
const fs = require("fs");
const userFile = "./database/user.json";
const userData = require(userFile);
console.log(userData);

const groupFile = "./database/group.json";
const groupData = require(groupFile);
console.log(groupData);

const channelFile = "./database/channel.json";
const channelData = require(channelFile);
console.log(channelData);

const memberFile = "./database/member.json";
const memberData = require(memberFile);
console.log(memberData);

module.exports = function(req, res) {

    // Error status code for empty request body
    if (!req.body) {return res.sendStatus(400);}

    // Verify user
    let userRes = {};
    console.log("Verifying user...");
    for (let user of userData) {
        
        // If user valid, build response data
        if (req.body.username == user.username) {
            userRes.user = user;
            userRes.user.valid = true;
            userRes.member = memberData.filter(x => x.userID == user.id);
            userRes.groups = [];
            userRes.channels = [];
            for (let mbr of userRes.member) {
                userRes.channels.push(channelData.find(x => x.id == mbr.channelID));
                let group = groupData.find(x => x.id == mbr.groupID);
                if (!userRes.groups.includes(group)) {
                    userRes.groups.push(group);
                }
            }
            console.log(userRes);
            break;
        }
    }

    if (userRes.user.valid) {console.log("Login success!");}
    else {console.log("Login failed. Username not found.");}

    res.send(userRes);
};