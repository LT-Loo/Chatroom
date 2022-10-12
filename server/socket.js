/* Socker for receiving request and returning response */

let roomRecords = {};

module.exports = {

    connect: function(io, PORT, db, ObjectID) {

        // let rooms = db.collection("channel").find({}, {_id: 1});
        // let username;

        //Receive connection request from client
        io.on("connection", (socket) => {
            console.log("User connection to port " + PORT + ": " + socket.id);

            // User must leave room before joining a new room
            // let currentRoom;
            // const safeJoin = (newRoom) => {
            //     socket.leave(currentRoom);
            //     socket.join(newRoom, () => {
            //         console.log(`Socket ${socket.id} joined room ${newRoom}`);
            //         currentRoom = newRoom;
            //     })
            // }

            let username;

            const leaveChannel = async () => {
                socket.leave(roomRecords[socket.id]); //, () => {

                let channelID = roomRecords[socket.id];
                console.log(`Socket ${socket.id} left room ${channelID}.`);

                let notice = {
                    type: 'notice',
                    notice: `${username} left the channel.`,
                    dateTime: new Date().toLocaleString()
                }

                await db.collection("chat").updateOne({channelID: channelID}, {$push: {history: notice}});
                io.to(channelID).emit("message", notice);
            }

            const joinChannel = async (channelID) => {
                socket.join(channelID); //, () => {
                // roomRecords[socket.id] = data.channelID;
                // username = data.username;
                console.log(`Socket ${socket.id} joined room ${channelID}.`);

                let notice = {
                    type: 'notice',
                    notice: `${username} has joined the channel.`,
                    dateTime: new Date().toLocaleString()
                }

                await db.collection("chat").updateOne({channelID: channelID}, {$push: {history: notice}});

                // socket.emit("join", true);
                io.to(channelID).emit("message", notice);
            }

            // Receive message from user
            socket.on("message", async (data) => {
                console.log(`Socket ${socket.id} sent a message to room ${roomRecords[socket.id]}`);
                //save to database
                //send data to channel user
                await db.collection("chat").updateOne({channelID: roomRecords[socket.id]}, {$push: {history: data}});
                io.to(roomRecords[socket.id]).emit("message", data);
            });

            socket.on("join", async (data) => {
                //safeJoin(roomID);
                // console.log("join request", data, socket.id, socket.rooms);
                // socket.join(data.channelID); //, () => {
                roomRecords[socket.id] = data.channelID;
                username = data.username;

                await joinChannel(data.channelID);
                // let chatHistory = await db.collection("chat").findOne({channelID: data.channelID});
                socket.emit("join", true);
                
                
            });

            socket.on("leave", async () => {
                await leaveChannel();
                // socket.leave(roomRecords[socket.id]); //, () => {

                // let channelID = roomRecords[socket.id];
                // console.log(`Socket ${socket.id} left room ${channelID}.`);
                // socket.emit("leave", true);

                // let notice = {
                //     notice: `${username} has left the channel.`,
                //     dateTime: new Date().toLocaleString()
                // }

                // db.collection("chat").updateOne({id: channelID}, {$push: {history: notice}});

                socket.emit("leave", true);
                delete roomRecords[socket.id];
                socket.disconnect();

                // io.to(channelID).emit("message", notice);
                
                    // currentRoom = roomID;
                //});
                // Emit to channel user left
            });

            socket.on("switch", async (roomID) => {
                await leaveChannel();
                await joinChannel(roomID);
                roomRecords[socket.id] = roomID;
                socket.emit("switch", true);
                // socket.disconnect();
            });

            socket.on("disconnect", async () => {
                console.log(`Socket ${socket.id} disconnected.`);
                // io.to(roomRecords[socket.id]).emit("notice", `${username} left the channel.`);

                let channelID = roomRecords[socket.id];
                let notice = {
                    type: "notice",
                    notice: `${username} has left the channel.`,
                    dateTime: new Date().toLocaleString()
                }

                await db.collection("chat").updateOne({channelID: channelID}, {$push: {history: notice}});

                // socket.emit("join", true);
                io.to(channelID).emit("message", notice);
                delete roomRecords[socket.id];
                // Emit to channel user left
            });

            socket.on("change", () => {
                // change on channels? members?
                // inform user to get new data from database
            });

        });
    }
}