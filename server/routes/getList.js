/* Route to get a list of items based on specific condition */

module.exports = function (db, app) {

    // Get list of items from specific collection
    app.post("/getList", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        const collection = db.collection(data.collection);

        let items = await collection.find(data.data).toArray();
        if (items) {
            console.log(`Successfully retrieved list of items from ${data.collection}`);
            return res.send({success: true, list: items});
        }
        else {
            console.log(`Retrieval items from ${data.collection} failed.`);
            return res.send({success: false});
        }

    });

    // Get channel date (Members and chat history)
    app.post("/getChannelData", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let id = req.body.id;

        let members = await db.collection("member").find({channelID: id}).toArray(); // Get members of channel
        let chat = await db.collection("chat").findOne({channelID: id}); // Get chat history

        let data = {members: members, chat: chat};

        if (members && chat) {
            console.log(`Successfully retrieved channel data from database.`);
            return res.send({success: true, list: data});
        }
        else {
            console.log(`Retrieval channel data from databade failed.`);
            return res.send({success: false});
        }

    });
}