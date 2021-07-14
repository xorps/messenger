require("dotenv").config()

const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../app.js");

chai.should();
chai.use(chaiHttp);

describe("/api/messages", () => {
  it("I should not be able to forge conversations", async () => {
    let response = await chai.request(app).post('/auth/login').set('Content-Type', 'application/json').send({username: 'hualing', password: '123456'});
    const { token } = response.body;
    const recipientId = 3;
    const conversationId = 2;
    const sender = {id: 4};
    const text = 'my forged message';
    response = await chai.request(app).post('/api/messages').set('x-access-token', token).set('Content-Type', 'application/json').send({recipientId, text, conversationId, sender});
    console.log(response.body);
    response.status.should.eq(401);
  });
});
