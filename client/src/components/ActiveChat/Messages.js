import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { useDispatch } from "react-redux";
import { postConversationRead } from "../../store/utils/thunkCreators";

const Messages = (props) => {
  const { messages, otherUser, userId, conversationId } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(postConversationRead({conversationId, senderId: otherUser.id}));
  }, [conversationId, otherUser.id, messages.length, dispatch]);

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
