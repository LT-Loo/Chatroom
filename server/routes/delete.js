/* Route to delete item from specific collection in database */

module.exports = function(db, app, ObjectID) {
    app.post("/delete", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        let itemID = new ObjectID(data._id)

        const collection = db.collection(data.collection);
        let result = await collection.deleteOne({_id: itemID});
        if (result.deletedCount > 0) {
            let list = await collection.find().toArray();
            console.log(`Successfully delete item in ${data.collection}.`);
            res.send({success: true, items: list});
        } else {
            console.log(`Failed to delete item from ${data.collection}.`);
            res.send({success: false});
        }

    });

    
}