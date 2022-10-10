/* Route to get all items in collection from database. */

module.exports = function (db, app) {
    app.post("/getList", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        const collection = db.collection(data.collection);

        let items = await collection.find().toArray();
        if (items) {console.log(`Successfully retrieved all items from ${data.collection}`);}
        else {console.log(`Retrieval items from ${data.collection} failed.`);}

        return res.send(items);
    });
}