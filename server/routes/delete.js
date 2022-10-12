/* Route to delete item from specific collection in database */

module.exports = function(db, app, ObjectID) {

    // Delete group
    app.post("/deleteGroup", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let id = req.body.id;
        let groupID = new ObjectID(id);

        let grpRes = await db.collection("group").deleteOne({_id: groupID}); // Delete group
        let chnRes = await db.collection("channel").deleteMany({groupID: id}); // Delete channels
        let mbrRes = await db.collection("member").deleteMany({groupID: id}); // Delete members
        let chatRes = await db.collection("chat").deleteMany({groupID: id}); // Delete chat history

        if (grpRes.acknowledged && chnRes.acknowledged && mbrRes.acknowledged && chatRes.acknowledged) {
            console.log(`Successfully deleted group ${id}`);
            return await res.send({success: true});
        } else {
            console.log(`Failed to delete group ${id}`);
            return await res.send({success: false});
        }
    });

    // Delete channel
    app.post("/deleteChannel", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let id = req.body.id;
        let channelID = new ObjectID(id);

        let chnRes = await db.collection("channel").deleteOne({_id: channelID}); // Delete channel
        let mbrRes = await db.collection("member").deleteMany({channelID: id}); // Delete members
        let chatRes = await db.collection("chat").deleteOne({channelID: id}); // Delete chat history

        if (chnRes.acknowledged && mbrRes.acknowledged) {
            console.log(`Successfully deleted channel ${id}`);
            return await res.send({success: true});
        } else {
            console.log(`Failed to delete channel ${id}`);
            return await res.send({success: false});
        }
    });
}