const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");
const db = require("../../db/db");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id",
      // subquery to count notifications
      // might be still possible to optimize further
        [db.literal(`(
          SELECT COUNT(*) FROM "messages"
          WHERE "messages"."conversationId" = "conversation"."id"
          AND ("messages"."senderId" = "user1"."id" OR "messages"."senderId" = "user2"."id")
          AND (
               ("messages"."createdAt" >= "conversation"."lastUser1Read" AND "conversation"."user1Id" != "messages"."senderId")
            OR ("messages"."createdAt" >= "conversation"."lastUser2Read" AND "conversation"."user2Id" != "messages"."senderId")
          )
        )`), 'notifications']
      ],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;
      conversations[i] = convoJSON;
    }

    // inplace, sort conversations by last message id, DESC order
    conversations.sort((a, b) => b.messages[b.messages.length - 1].id - a.messages[a.messages.length - 1].id);

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.patch("/read", async (req, res, next) => {
  try {
    if (!req.user) { return res.sendStatus(401); }
    const senderId = req.user.id;
    const { conversationId } = req.body;
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) { return res.sendStatus(403); }
    const key = (({user1Id, user2Id}) => {
      if (senderId === user1Id) return 'lastUser1Read';
      if (senderId === user2Id) return 'lastUser2Read';
      throw new Error(`senderId: ${senderId} failed to match`);
    })(conversation);
    conversation[key] = db.literal('CURRENT_TIMESTAMP');
    await conversation.save();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
