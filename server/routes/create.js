/* Route to add new item into database */

module.exports = function(db, app) {
    app.post("/create", async function (req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        const collection = db.collection(data.collection);

        let result = await collection.insertOne(data);
        let msg = `Item added successfully into ${data.collection}.`;
        console.log(msg);

        if (result.acknowledged) {res.send({success: true});}
        else {res.send({success: false, msg: "Data insertion failed."});}
    });
}