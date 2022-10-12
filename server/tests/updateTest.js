let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

let URL = "http://localhost:3000";

describe("Update Route Tests", () => {

    describe("Update Item", () => {

        it("Should update user password successfully", (done) => {
            chai.request(URL).post("/update").send(
                {collection: "user", data: {_id: "6343d8a6e193b5bd1398b915", password: "password"}}
            ).end((err, res) => {
                expect(res.body.success).to.be.true;
                done();
            });
        });

        it("Should do nothing if item not found", (done) => {
            chai.request(URL).post("/update").send(
                {collection: "user", data: {_id: "6343d8a6e193b5b81378b925", password: "password"}}
            ).end((err, res) => {
                expect(res.body.success).to.be.false;
                done();
            });
        });

    });

    describe("Upgrade User", () => {

        it("Should upgrade user role successfully", (done) => {
            chai.request(URL).post("/upgradeUser").send(
                {username: "Lily", role: "admin"}
            ).end((err, res) => {
                expect(res.body.success).to.be.true;
                expect(res.body).to.have.property("userData");
                expect(res.body.userData.superOrAdmin).to.equal("admin");
                done();
            });
        });

        it("Should return false if user selected not found", (done) => {
            chai.request(URL).post("/upgradeUser").send(
                {username: "123", role: "admin"}
            ).end((err, res) => {
                expect(res.body.success).to.be.false;
                expect(res.body).to.not.have.property("userData");
                done();
            });
        });
    });

});