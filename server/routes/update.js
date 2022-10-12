/* Route to update item in specific collection in database */

const bcrypt = require("bcrypt");

module.exports = function(db, app, ObjectID) {

    // Update item 
    app.post("/update", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        let itemID = new ObjectID(data.data._id);
        
        // If data to update is password, encrypt password
        if ("password" in data.data) {data.data.password = await bcrypt.hash(data.data.password, 10);}

        const collection = db.collection(data.collection);
        delete data.data["_id"];
        let result = await collection.updateOne({_id: itemID}, {$set: data.data}); // Update data
        if (result.matchedCount == 1) {
            console.log(`Successfully update data in ${data.collection}.`);
            res.send({success: true});
        } else {
            console.log(`Failed to update data in ${data.collection}.`);
            res.send({success: false});
        }
    });

    // Upgrade user role
    app.post("/upgradeUser", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;

        // Get user data
        let user = await db.collection("user").findOne({username: data.username});
        if (!user) {res.send({success: false});} 

        // Update overall role
        let userChg = await db.collection("user").updateOne({_id: user._id}, {$set: {superOrAdmin: data.role}});

        let mbrChg = {}; // Update member (in group) role if necessary
        if (data.role == "super") {mbrChg = await db.collection("member").updateMany({userID: user._id.toString()}, {$set: {role: data.role}});}
        else {mbrChg.acknowledged = true;}
        
        let updateUser = await db.collection("user").findOne({username: data.username});
        if (userChg.acknowledged && mbrChg.acknowledged) {
            console.log(`Successfully upgrade role for ${data.username}.`);
            res.send({success: true, userData: updateUser});
        } else {
            console.log(`Failed to upgrade role for ${data.username}.`);
            res.send({success: false});
        }
    });
}