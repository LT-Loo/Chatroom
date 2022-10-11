/* Route to get one item from specific collection in database */

module.exports = function(db, app, ObjectID) {
    app.post("/getItem", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        let itemID = new ObjectID(data._id);
        console.log(data._id);

        const collection = db.collection(data.collection);
        let item = await collection.findOne({"_id": itemID});
        if (item) {
            console.log(`Successfully retrieved item from ${data.collection}`);
            return res.send({success: true, itemData: item});
        }
        else {
            console.log(`Retrieval item from ${data.collection} failed.`);
            return res.send({success: false});
        }

    });
}