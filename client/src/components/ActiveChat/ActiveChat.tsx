import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { isUser, useSelector } from "../../store/index";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
}));

const ActiveChat = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const activeConversation = useSelector((state) => state.activeConversation);
  const conversations = useSelector((state) => state.conversations);
  const conversation = conversations?.find(
    (c) => c.otherUser.username === activeConversation
  );

  if (isUser(user) && conversation?.otherUser) {
    return (
      <Box className={classes.root}>
        <Header
          username={conversation.otherUser.username}
          online={conversation.otherUser.online}
        />
        <Box className={classes.chatContainer}>
          <Messages
            conversationId={conversation.id}
            messages={conversation.messages}
            otherUser={conversation.otherUser}
            userId={user.id}
          />
          <Input
            otherUser={conversation.otherUser}
            conversationId={conversation.id}
            user={user}
          />
        </Box>
      </Box>
    );
  } else {
    return <Box className={classes.root} />;
  }
};

export default ActiveChat;
