/* Route to add new item into database */

module.exports = function(db, app, ObjectID) {

    // Add new group
    app.post("/newGroup", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        console.log(data);

        // Insert group data 
        let newGroup = await db.collection("group").insertOne({name: data.name, dateTime: data.dateTime});
        if (newGroup.acknowledged) {

            let admins = await db.collection("user").find({superOrAdmin: "super"}).toArray();
            if (data.creator.superOrAdmin == "admin") {admins.push(data.creator);}

            for (let channel of data.channelList) { // Insert new channels 
                let channelData = {
                    name: channel,
                    groupID: newGroup.insertedId.toString(),
                    dateTime: data.dateTime
                };

                let newChannel = await db.collection("channel").insertOne(channelData);

                let chatData = {groupID: newGroup.insertedId.toString(), channelID: newChannel.insertedId.toString(), history: []};
                await db.collection("chat").insertOne(chatData);

                for (let admin of admins) { // Insert members (Super and Group Admin)
                    let memberData = {
                        userID: admin._id.toString(),
                        username: admin.username,
                        groupID: newGroup.insertedId.toString(),
                        groupname: data.name,
                        channelID: newChannel.insertedId.toString(),
                        channelName: channel,
                        role: admin.superOrAdmin
                    };
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

    // Insert new channel
    app.post("/newChannel", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        console.log(data);

        // Get group channel belongs to
        let group = await db.collection("group").findOne({_id: new ObjectID(data.groupID)});
        if (!group) {res.send({success: false, error: "No group found."});}

        // Insert new channel
        let newChannel = await db.collection("channel").insertOne({name: data.name, groupID: data.groupID, dateTime: data.dateTime});

        // Create and insert empty chat history
        let chatData = {groupID: data.groupID, channelID: newChannel.insertedId.toString(), history: []};
        await db.collection("chat").insertOne(chatData);

        if (newChannel.acknowledged) {

            let admins = await db.collection("member").find({$and :[{groupID: data.groupID}, {$or: [{role: "super"}, {role: "admin"}, {role: "assis"}]}]}).toArray();

            let members = [];
            for (let admin of admins) { // Insert Super and Group Admin
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

            for (let member of data.memberList) { // Insert member
                if (!members.includes(member)) {
                    let mbrData = await db.collection("user").findOne({username: member});
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

    // Add member to existing channel
    app.post("/addMember", async function(req, res) {

        if (!req.body) {return res.sendStatus(400);}

        let data = req.body;
        console.log(data);

        // Get required data
        let channel = await db.collection("channel").findOne({_id: new ObjectID(data.channelID)});
        let group = await db.collection("group").findOne({_id: new ObjectID(data.groupID)});
        let members = await db.collection("member").find({channelID: data.channelID}).toArray();

        for (let newMember of data.memberList) { // Insert member 
            if (!members.find(x => x.username == newMember)) {
                let mbr = await db.collection("user").findOne({username: newMember});
                if (!mbr) {res.send({success: false, error: "User not found."});}
                let memberData = {
                    userID: mbr._id.toString(),
                    username: mbr.username,
                    groupID: data.groupID,
                    groupname: group.name,
                    channelID: data.channelID,
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