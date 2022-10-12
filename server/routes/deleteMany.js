/* Route to delete multiple items from specific collection in database */

module.exports = function(db, app) {
    app.post("/deleteMany", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        console.log(data);

        const collection = db.collection(data.collection);
        let result = await collection.deleteMany(data.data);
        if (result.deletedCount > 0) {
            console.log(`Successfully delete items in ${data.collection}.`);
            res.send({success: true});
        } else {
            console.log(`Failed to delete items from ${data.collection}.`);
            res.send({success: false});
        }

    });

    
}