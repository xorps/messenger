import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from ".";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { Conversation, useDispatch } from "../../store/index";

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
}));

export default function Chat({ conversation }: { conversation: Conversation }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <Box
      onClick={() => dispatch(setActiveChat(conversation.otherUser.username))}
      className={classes.root}
    >
      <BadgeAvatar
        photoUrl={conversation.otherUser.photoUrl}
        username={conversation.otherUser.username}
        online={conversation.otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
    </Box>
  );
}
