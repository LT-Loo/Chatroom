/* Route to add new item into database */

module.exports = function(db, app, ObjectID) {
    app.post("/create", async function (req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        const collection = db.collection(data.collection);

        let result = await collection.insertOne(data.data);
        let msg = `Item added successfully into ${data.collection}.`;
        console.log(msg);

        if (result.acknowledged) {
            let item = await collection.findOne({"_id": result.insertedId});
            console.log("item: ", item);
            return res.send({success: true, item: item});
        }
        else {return res.send({success: false});}
    });

    app.post("/newGroup", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        console.log(data);

        let newGroup = await db.collection("group").insertOne({name: data.name, dateTime: data.dateTime});
        if (newGroup.acknowledged) {
            console.log("group added");
            let admins = await db.collection("user").find({superOrAdmin: "super"}).toArray();
            if (data.creator.superOrAdmin == "admin") {admins.push(data.creator);}

            for (let channel of data.channelList) {
                let channelData = {
                    name: channel,
                    groupID: newGroup.insertedId.toString(),
                    dateTime: data.dateTime
                };

                console.log("add channel");
                let newChannel = await db.collection("channel").insertOne(channelData);

                for (let admin of admins) {
                    let memberData = {
                        userID: admin._id.toString(),
                        username: admin.username,
                        groupID: newGroup.insertedId.toString(),
                        groupname: data.name,
                        channelID: newChannel.insertedId.toString(),
                        channelName: channel,
                        role: admin.superOrAdmin
                    };
                    console.log("add memebr");
                    await db.collection("member").insertOne(memberData);
                }
            }
            console.log(`New group ${data.name} successfully created.`);
            return await res.send({success: true});
        } else {
            console.log(`Failed to create new group ${data.name}.`);
            return await res.send({success: false});
        }
    });

    app.post("/newChannel", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        console.log(data);

        let group = await db.collection("group").findOne({_id: new ObjectID(data.groupID)});

        let newChannel = await db.collection("channel").insertOne({name: data.name, groupID: data.groupID, dateTime: data.dateTime});
        if (newChannel.acknowledged) {
            console.log("channel added");
            let admins = await db.collection("member").find({$and :[{groupID: data.groupID}, {$or: [{role: "super"}, {role: "admin"}, {role: "assis"}]}]}).toArray();
            // if (data.creator.superOrAdmin == "admin") {admins.push(data.creator);}
            console.log(admins);
            let members = [];
            for (let admin of admins) {
                if (!members.includes(admin.username)) {
                    let memberData = {
                        userID: admin.userID,
                        username: admin.username,
                        groupID: group._id.toString(),
                        groupname: group.name,
                        channelID: newChannel.insertedId.toString(),
                        channelName: data.name,
                        role: admin.role
                    }

                    console.log("add admin");
                    await db.collection("member").insertOne(memberData);
                    members.push(admin.username);

                };

                
            }

            for (let member of data.memberList) {
                if (!members.includes(member)) {
                    let mbrData = await db.collection("user").findOne({username: member});
                    console.log("newmember: ", mbrData);
                    let memberData = {
                        userID: mbrData._id.toString(),
                        username: mbrData.username,
                        groupID: group._id.toString(),
                        groupname: group.name,
                        channelID: newChannel.insertedId.toString(),
                        channelName: data.name,
                        role: "member"
                    };
                    
                    await db.collection("member").insertOne(memberData);
                    members.push(member);
                }
            }

            console.log(`New channel ${data.name} successfully added into group.`);
            return await res.send({success: true});
        } else {
            console.log(`Failed to create new channel ${data.name}.`);
            return await res.send({success: false});
        }
    });

    app.post("/addMember", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        console.log(data);

        let channel = await db.collection("channel").findOne({_id: new ObjectID(data.channelID)});
        let group = await db.collection("group").findOne({_id: new ObjectID(channel.groupID)});
        let members = await db.collection("member").find({channelID: data.channelID}).toArray();

        for (let newMember of data.memberList) {
            if (!members.find(x => x.username == newMember)) {
                let mbr = await db.collection("user").findOne({username: newMember});
                let memberData = {
                    userID: mbr._id.toString(),
                    username: mbr.username,
                    groupID: group._id.toString(),
                    groupname: group.name,
                    channelID: channel._id.toString(),
                    channelName: channel.name,
                    role: "member"
                }
                await db.collection("member").insertOne(memberData);
            }
        }
           
        console.log(`Members successfully added into channel ${channel._id.toString()}.`);
        return await res.send({success: true});
    });
}