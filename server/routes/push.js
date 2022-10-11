/* Route to update item by pushing data into array */

module.exports = function(db, app, ObjectID) {
    app.post("/update-push", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        let itemID = new ObjectID(data.id);

        const collection = db.collection(data.collection);
        let result = await collection.updateOne({_id: itemID}, {$push: data.data});
        if (result.matchedCount == 1) {
            console.log(`Successfully update data in ${data.collection}.`);
            res.send({success: true});
        } else {
            console.log(`Failed to update data in ${data.collection}.`);
            res.send({success: false});
        }
    });
}