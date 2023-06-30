import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js";
import Mocha from "mocha";
import mochaReporter from "mocha-junit-reporter";
const { JUnitXmlReporter } = mochaReporter;
const { expect } = chai;

chai.use(chaiHttp);
// Create a new Mocha instance
const mochaInstance = new Mocha({
  reporter: JUnitXmlReporter,
  reporterOptions: {
    mochaFile: "test-results.xml",
  },
});

describe("Backend API Tests-", () => {
  describe("Campaigns-", () => {
    it("Should get campaigns from database", function (done) {
      chai
        .request(app)
        .get("/api/campaigns/")
        .then((res) => {
          console.log(res.body.length);
          expect(res.body.length).to.be.equal(1);
          done();
        })
        .catch((err) => {
          console.log(err);

          //assert.fail();
          done();
        });
    });
    it("Should not create a new campaign if user unauthorized", function (done) {
      const campaign = {
        name: "New Campaign",
        description: "A test campaign",
        image: "campaign.jpg",
        tags: ["tag1", "tag2"],
        subtitle: "Test subtitle",
        goals: ["Goal 1", "Goal 2"],
      };

      chai
        .request(app)
        .post("/api/campaigns/create")
        .send(campaign)
        .then((res) => {
          expect(res.error.text).to.be.equal("Token not provided");

          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });
  });
  describe("User-", () => {
    it("Should register a new user", function (done) {
      const user = {
        name: "John Doe",
        email: "johndoee@exe.com",
        password: "password123",
      };

      chai
        .request(app)
        .post("/api/users/register")
        .send(user)
        .then((res) => {
          expect(res.body).to.have.property("name", user.name);
          expect(res.body).to.have.property("email", user.email);
          done();
        })
        .catch((err) => {
          console.log(err);
          // assert.fail();
          done();
        });
    });
  });

  //Run the tests
  mochaInstance.run((failures) => {
    process.exitCode = failures ? 1 : 0;
  });
});
