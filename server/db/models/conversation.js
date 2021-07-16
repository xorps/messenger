const Sequelize = require("sequelize");
const db = require("../db");
const { Op } = Sequelize;

const Conversation = db.define("conversation", {
  lastUser1Read: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: db.literal('CURRENT_TIMESTAMP'),
  },
  lastUser2Read: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: db.literal('CURRENT_TIMESTAMP'),
  }
});

Conversation.findConversationById = ({id, user1Id, user2Id}) =>
  Conversation.findOne({
    where: {
      id: id,
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      }
    }
  });


// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      }
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
