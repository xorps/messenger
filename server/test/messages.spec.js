require("dotenv").config()

const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../app.js");
const Message = require("../db/models/message");

chai.should();
chai.use(chaiHttp);

async function login(username, password) {
  const response = await chai.request(app).post('/auth/login').set('Content-Type', 'application/json').send({username, password});
  return response.body;
}

async function sendMessage({conversationId, text, recipientId, sender}) {
  const { token } = sender;
  const response = await chai.request(app)
    .post('/api/messages')
    .set('x-access-token', token)
    .set('Content-Type', 'application/json')
    .send({recipientId, text, conversationId, sender});
  return response;
}

describe("/api/messages", () => {
  it("I should not be able to forge conversations", async () => {
    const sender = await login('hualing', '123456');
    const response = await sendMessage({
      conversationId: 2,
      recipientId: 3,
      text: 'my forged message',
      sender
    });
    response.status.should.eq(403);
  });
});

describe("/api/messages/read", () => {
  it("should mark messages read", async () => {
    const sender = await login('santiago', '123456');
    const { message } = await (async () => {
      const r = await sendMessage({
        recipientId: 3,
        sender,
        text: 'message test'
      });
      return r.body;
    })();
    const receiver = await login('chiumbo', '123456');
    const response = await chai.request(app)
      .patch('/api/messages/read')
      .set('x-access-token', receiver.token)
      .set('Content-Type', 'application/json')
      .send({conversationId: message.conversationId, messageId: message.id});
    response.status.should.eq(204);
    (await Message.findByPk(message.id)).read.should.eq(true);
  });
})
