/* Route to retrieve user by ID from database */

module.exports = function(db, app, ObjectID) {
    app.post("/getUserByID", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        // let data = req.body;
        let userID = new ObjectID(req.body);

        const collection = db.collection("user");
        let user = await collection.findOne({"_id": userID});
        if (user) {
            console.log(`Successfully retrieved user.`);
            return res.send({success: true, userData: user});
        } else {
            console.log(`Retrieval user from database failed.`);
            return res.send({success: false});
        }
    });
}