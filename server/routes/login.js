// User verification from login request

const bcrypt = require("bcrypt");

module.exports = function(db, app) {
    app.post("/login", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let userReq = req.body;

        const collection = db.collection("user");
        let user = await collection.findOne({"username": userReq.username}); // Get user
        if (user) { // Is user exist
            if (await bcrypt.compare(userReq.password, user.password)) { // Validate password
                console.log(`User ${user.username} login success.`);
                res.send({success: true, userData: user});    
            } else {
                console.log(`User ${user.username}'s login failed [Invalid password]`);
                res.send({success: false});
            }
        } else { // If invalid user
            console.log(`User ${userReq.username}'s login failed [User not found]`);
            res.send({success: false});
        }
    });
}