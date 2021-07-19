import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from ".";
import moment from "moment";
import { Message, ID, User, useDispatch } from "../../store/index";
import { postConversationRead } from "../../store/utils/thunkCreators";

type Args = {
  messages: Message[];
  conversationId: ID;
  otherUser: User;
  userId: ID;
};

export default function Messages({
  messages,
  otherUser,
  userId,
  conversationId,
}: Args) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(postConversationRead({ conversationId, senderId: otherUser.id }));
  }, [conversationId, otherUser.id, messages.length, dispatch]);

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
}
