/* Route to delete item from specific collection in database */

module.exports = function(db, app, ObjectID) {
    // app.post("/delete", async function(req, res) {

    //     if (!req.body) {return res.sendStatus(400);}

    //     let data = req.body;
    //     let itemID = new ObjectID(data._id);

    //     const collection = db.collection(data.collection);
    //     let result = await collection.deleteOne({_id: itemID});
    //     if (result.deletedCount > 0) {
    //         let list = await collection.find().toArray();
    //         console.log(`Successfully delete item in ${data.collection}.`);
    //         res.send({success: true, items: list});
    //     } else {
    //         console.log(`Failed to delete item from ${data.collection}.`);
    //         res.send({success: false});
    //     }

    // });

    app.post("/deleteGroup", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let id = req.body.id;
        let groupID = new ObjectID(id);

        let grpRes = await db.collection("group").deleteOne({_id: groupID});
        let chnRes = await db.collection("channel").deleteMany({groupID: id});
        let mbrRes = await db.collection("member").deleteMany({groupID: id});
        let chatRes = await db.collection("chat").deleteMany({groupID: id});

        if (grpRes.acknowledged && chnRes.acknowledged && mbrRes.acknowledged && chatRes.acknowledged) {
            console.log(`Successfully deleted group ${id}`);
            return await res.send({success: true});
        } else {
            console.log(`Failed to delete group ${id}`);
            return await res.send({success: false});
        }
    });

    app.post("/deleteChannel", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let id = req.body.id;
        let channelID = new ObjectID(id);

        let chnRes = await db.collection("channel").deleteOne({_id: channelID});
        let mbrRes = await db.collection("member").deleteMany({channelID: id});
        let chatRes = await db.collection("chat").deleteOne({channelID: id});

        if (chnRes.acknowledged && mbrRes.acknowledged) {
            console.log(`Successfully deleted channel ${id}`);
            return await res.send({success: true});
        } else {
            console.log(`Failed to delete channel ${id}`);
            return await res.send({success: false});
        }
    });

    
}