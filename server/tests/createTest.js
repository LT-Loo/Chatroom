/* Create Route Tests */

let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

let URL = "http://localhost:3000";

describe("Create Route Tests", () => {

    describe("Create New User", () => {

        it("Should return true and user data", (done) => {
            chai.request(URL).post("/register").send(
            {username: "Lily", email: "lily@example.com", lastActive: "12 Oct 2022 10:30AM", superOrAdmin: "none"}
            ).end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body).to.have.property("item");
                expect(res.body.item).to.not.be.empty;
                done();
            });
        });
    });

    describe("Create New Group", () => {
        it("Should return true after creating new group with no channel", (done) => {
            chai.request(URL).post("/newGroup").send(
                {name: "group1", dateTime: "12 Oct 2022 10:30AM", channelList: [], creator: "me"}
            ).end((err, res) => {
                expect(res.body.success).to.be.true;
                done();
            });
        });

        it("Should return true after creating new group with channels", (done) => {
            chai.request(URL).post("/newGroup").send(
                {name: "group13", dateTime: "12 Oct 2022 10:30AM", channelList: ["testChannel"], creator: "me"}
            ).end((err, res) => {
                expect(res.body.success).to.be.true;
                done();
            });
        });
    });

    describe("Create New Channel", () => {
        it("Should return true after creating new channel", (done) => {
            chai.request(URL).post("/newChannel").send(
                {name: "channel123", groupID: "634693eaa7a39526b470033a", dateTime: "12 Oct 2022 10:30AM", memberList: []}
            ).end((err, res) => {
                expect(res.body.success).to.be.true;
                done();
            });
        });

        it("Should return false if group not found", (done) => {
            chai.request(URL).post("/newChannel").send(
                {name: "channel43", groupID: "6376de8e78db7e2a369cf4d9", dateTime: "12 Oct 2022 10:30AM", memberList: []}
            ).end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body.error).to.equal("No group found.");
                done();
            });
        });
    });

    describe("Add Member to Channel", () => {
        it("Should return true after adding member to channel", (done) => {
            chai.request(URL).post("/addMember").send(
                {channelID: "6346de4e78db7e2a369cf4db", groupID: "6346de4e78db7e2a369cf4da", memberList: ["usr", "user1"]}
            ).end((err, res) => {
                expect(res.body.success).to.be.true;
                done();
            });
        });

        it("Should return true if member not found", (done) => {
            chai.request(URL).post("/addMember").send(
                {channelID: "6346de4e78db7e2a369cf4db", groupID: "6346de4e78db7e2a369cf4da", memberList: ["lily", "john"]}
            ).end((err, res) => {
                expect(res.body.success).to.be.false;
                done();
            });
        });

    });


});