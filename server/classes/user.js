// User class

var { v4: uuid4 } = require("uuid");

class User {
    constructor(username, email, role = "User") {
        this.id = uuid4();
        this.username = username;
        this.email = email;
        this.lastActive = new Date();
        this.role = role;
    } 
}

module.exports = User;
