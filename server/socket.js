/* Socker for receiving request and returning response */

let roomRecords = {}; // Store socket ID and channel ID each socket joined

module.exports = {

    connect: function(io, PORT, db, ObjectID) {

        //Receive connection request from client
        io.on("connection", (socket) => {
            console.log("User connection to port " + PORT + ": " + socket.id);

            let username;

            // Leave channel
            const leaveChannel = async () => {
                socket.leave(roomRecords[socket.id]); // Leave

                let channelID = roomRecords[socket.id];
                console.log(`Socket ${socket.id} left room ${channelID}.`);

                // Update chat history
                let notice = {
                    type: 'notice',
                    notice: `${username} left the channel.`,
                    dateTime: new Date().toLocaleString()
                }
                await db.collection("chat").updateOne({channelID: channelID}, {$push: {history: notice}});

                io.to(channelID).emit("message", notice); // Notify users in channel
            }

            // Join channel
            const joinChannel = async (channelID) => {
                socket.join(channelID); // Join
                console.log(`Socket ${socket.id} joined room ${channelID}.`);

                // Update chat history
                let notice = {
                    type: 'notice',
                    notice: `${username} has joined the channel.`,
                    dateTime: new Date().toLocaleString()
                }
                await db.collection("chat").updateOne({channelID: channelID}, {$push: {history: notice}});
;
                io.to(channelID).emit("message", notice); // Notify users in channel
            }

            // Receive message
            socket.on("message", async (data) => {
                console.log(`Socket ${socket.id} sent a message to room ${roomRecords[socket.id]}`);

                // Update chat history and notify user in channel
                await db.collection("chat").updateOne({channelID: roomRecords[socket.id]}, {$push: {history: data}});
                io.to(roomRecords[socket.id]).emit("message", data);
            });

            // Receive join request
            socket.on("join", async (data) => {

                // Keep track of channel user joined
                roomRecords[socket.id] = data.channelID;
                username = data.username;

                await joinChannel(data.channelID); // Join
                socket.emit("join", true); // Return response to user
            });

            // Receive leave request
            socket.on("leave", async () => {
                await leaveChannel(); // Leave
                socket.emit("leave", true); // Return response to user
                delete roomRecords[socket.id]; // Delete record
                socket.disconnect(); // Disconnect socket
            });

            // Receive switch channel request
            socket.on("switch", async (roomID) => {
                await leaveChannel(); // Leave current channel
                await joinChannel(roomID); // Join new channel
                roomRecords[socket.id] = roomID; // Update record
                socket.emit("switch", true); // Return response to user
            });

            // If client socket disconnect from server socker
            socket.on("disconnect", async () => {
                console.log(`Socket ${socket.id} disconnected.`);

                // Update chat history (Consider user as leaving channel)
                let channelID = roomRecords[socket.id];
                let notice = {
                    type: "notice",
                    notice: `${username} has left the channel.`,
                    dateTime: new Date().toLocaleString()
                }
                await db.collection("chat").updateOne({channelID: channelID}, {$push: {history: notice}});

                io.to(channelID).emit("message", notice); // Notify users in channel
                delete roomRecords[socket.id]; // Delete record
            });

        });
    }
}