/* Restrieva Route Tests */

let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

let URL = "http://localhost:3000";

describe("Retrieve Item Route Tests", () => {

    describe("Single Item", () => {

        it("Should get item from collection (group) with valid _id", (done) => {
            chai.request(URL).post("/getItem").send(
                {collection: "group", _id: "6346de4e78db7e2a369cf4da"}
            ).end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body).to.have.property("itemData");
                expect(res.body.itemData).to.not.be.empty;
                done();
            });
        });

        it("Should not get any item from collection (channel) with invalid _id", (done) => {
            chai.request(URL).post("/getItem").send(
                {collection: "channel", _id: "6346de4e78db7e2a369cf4da"}
            ).end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body).to.not.have.property("itemData");
                done();
            });
        });
    });

    describe("List of Items", () => {

        it("Should get list of members with given channel ID", (done) => {
            chai.request(URL).post("/getList").send(
                {collection: "member", data: {channelID: '63454348f4557c168a5ca19b'}}
            ).end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body).to.have.property("list");
                expect(res.body.list).to.be.a("array");
                expect(res.body.list).to.not.be.empty;
                done();
            });
        });

        it("Should not get any item for unmatched data", (done) => {
            chai.request(URL).post("/getItem").send(
                {collection: "channel", data: {groupID: '63454348f4557c168a5ca19b'}}
            ).end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body).to.not.have.property("list");
                done();
            });
        });
    });

    describe("All Items in Collection", () => {

        it("Should get list of all items in specified collection (user)", (done) => {
            chai.request(URL).post("/getAll").send({collection: "user"}).end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body).to.have.property("items");
                expect(res.body.items).to.not.be.empty;
                done();
            });
        });
    });

    describe("Get Channel Data", () => {

        it("Should get channel data with given channel ID", (done) => {
            chai.request(URL).post("/getChannelData").send(
                {id: '634693eaa7a39526b470033b'}
            ).end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body).to.have.property("list");
                expect(res.body.list).to.have.property("members");
                expect(res.body.list).to.have.property("chat");
                expect(res.body.list.members).to.not.be.empty;
                expect(res.body.list.chat).to.not.be.empty;
                done();
            });
        });

        it("Should return false for invalid channel ID", (done) => {
            chai.request(URL).post("/getChannelData").send(
                {id: '63454348r4757c168a8ca19b'}
            ).end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body).to.not.have.property("list");
                done();
            });
        });
    });

});