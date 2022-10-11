/* Socker for receiving request and returning response */

module.exports = {
    connect: function(io, PORT, db, ObjectID) {

        // let rooms = db.collection("channel").find({}, {_id: 1});
        let roomRecords = {};
        let username;

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

            // Receive message from user
            socket.on("message", (msg) => {
                console.log(`Socket ${socket.id} sent a message to room ${roomRecords[socket.id]}`);
                //save to database
                //send data to channel user
                io.to(roomRecords[socket.id]).emit("message", );
            });

            socket.on("join", (data) => {
                //safeJoin(roomID);
                socket.join(data.channelID, () => {
                    roomRecords[socket.id] = data.channelID;
                    username = data.username;
                    console.log(`${socket.id} joined room ${roomID}.`);
                    socket.emit("join", true);
                    io.to(data.channelID).emit("notice", `${data.username} joined the channel.`);
                    // currentRoom = null;
                    //Emit to new channel user joined
                })
            });

            socket.on("leave", () => {
                socket.leave(roomRecords[socket.id], () => {
                    console.log(`Socket ${socket.id} left room ${roomRecords[socket.id]}.`);
                    socket.emit("leave", true);
                    io.to(roomRecords[socket.id]).emit("notice", `${username} left the channel.`);
                    delete roomRecords[socket.id];
                    // currentRoom = roomID;
                });
                // Emit to channel user left
            });

            socket.on("switch", (roomID) => {
                socket.leave(roomRecords[socket.id], () => {
                    console.log(`Socket ${socket.id} left room ${roomRecords[socket.id]}`);
                    io.to(roomRecords[socket.id]).emit("notice", `${username} left the channel.`);
                });
                socket.join(roomID, () => {
                    console.log(`Socket ${socket.id} joined room ${roomID}`);
                    roomRecords[socket.id] = roomID;
                    socket.emit("switch", true);
                    io.to(roomID).emit("notice", `${username} joined the channel.`);
                    // currentRoom = newRoom;
                })
                // Emit to old user left
                // Emit to new user joined
            });

            socket.on("disconnect", () => {
                console.log(`Socket ${socket.id} left room ${roomRecords[socket.id]}.`);
                io.to(roomRecords[socket.id]).emit("notice", `${username} left the channel.`);
                delete roomRecords[socket.id];
                // Emit to channel user left
            });

            socket.on("change", () => {
                // change on channels? members?
                // inform user to get new data from database
            })

        })
    }
}