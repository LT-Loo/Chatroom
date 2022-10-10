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
}