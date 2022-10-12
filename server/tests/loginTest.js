let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

let URL = "http://localhost:3000";

describe("Login Route Test", () => {

    it("Should return false when user not found", (done) => {
        chai.request(URL).post("/login").send({username: "", password: ""}).end((err, res) => {
            expect(res.body.success).to.be.false;
            done();
        });
    });

    it("Should return false when password is invalid", (done) => {
        chai.request(URL).post("/login").send({username: "super", password: "aaa"}).end((err, res) => {
            expect(res.body.success).to.be.false;
            expect(res.body).to.not.have.property('userData');
            done();
        });
    });

    it("Should return true and user data when user is valid", (done) => {
        chai.request(URL).post("/login").send({username: "usr", password: "password"}).end((err, res) => {
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('userData');
            expect(res.body.userData).to.not.be.empty;
            done();
        });
    });
});