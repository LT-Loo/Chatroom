/* Route to update item in specific collection in database */

module.exports = function(db, app, ObjectID) {
    app.post("/update", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        let itemID = new ObjectID(data._id);

        const collection = db.collection(data.collection);
        delete data["_id"];
        let result = await collection.updateOne({_id: itemID}, {$set: data});
        if (result.matchedCount == 1) {
            console.log(`Successfully update data in ${data.collection}.`);
            res.send({success: true});
        } else {
            console.log(`Failed to update data in ${data.collection}.`);
            res.send({success: false});
        }
    });

    app.post("/upgradeUser", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        // let itemID = new ObjectID(data._id);

        let user = await db.collection("user").findOne({username: data.username});
        console.log(user);
        // const collection = db.collection(data.collection);
        // delete data["username"];
        let userChg = await db.collection("user").updateOne({_id: user._id}, {$set: {superOrAdmin: data.role}});

        let mbrChg = {};
        if (data.role == "super") {mbrChg = await db.collection("member").updateMany({userID: user._id.toString()}, {$set: {role: data.role}});}
        else {mbrChg.acknowledged = true;}
        
        if (userChg.acknowledged && mbrChg.acknowledged) {
            console.log(`Successfully upgrade role for ${data.username}.`);
            res.send({success: true});
        } else {
            console.log(`Failed to upgrade role for ${data.username}.`);
            res.send({success: false});
        }
    });
}