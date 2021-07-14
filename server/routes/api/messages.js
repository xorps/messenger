const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require('sequelize');
const { app } = require("../../app");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      // make sure sender & recipient are part of the conversation
      const conversation = await Conversation.findConversationById({id: conversationId, user1Id: senderId, user2Id: recipientId});
      if (!conversation) { 
        // Otherwise, fail with 403 response.
        return res.sendStatus(403); 
      }
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.post("/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { conversationId, messageId } = req.body;
    const message = await Message.findOne({
      include: {
        model: Conversation,
        where: {
          [Op.or]: {user1Id: senderId, user2Id: senderId}
        }
      },
      where: {
        id: messageId,
        conversationId: conversationId,
        senderId: {[Op.not]: senderId}
      }
    });
    if (!message) {
      return res.sendStatus(403);
    }
    message.read = true;
    await message.save();
    res.json({success: true});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
