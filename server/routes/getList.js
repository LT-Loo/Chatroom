/* Route to get a list of items based on specific condition */

module.exports = function (db, app) {
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
}