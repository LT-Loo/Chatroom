/* Route to retrieve user by name from database */

module.exports = function(db, app) {
    app.post("/getUserByName", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        const collection = db.collection("user");
        let user = await collection.findOne({"username": data.username});
        if (user) {
            console.log(`Successfully retrieved user.`);
            return res.send({success: true, userData: user});
        } else {
            console.log(`Retrieval user from database failed.`);
            return res.send({success: false});
        }
    });
}