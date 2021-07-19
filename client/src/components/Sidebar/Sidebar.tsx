import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Search, Chat, CurrentUser } from "./index";
import { useSelector } from "../../store/index";

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: 21,
    paddingRight: 21,
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15,
  },
}));

type Args = {
  searchTerm: string;
  handleChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
};

const Sidebar = ({ searchTerm, handleChange }: Args) => {
  const conversations = useSelector((state) => state.conversations);
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {conversations &&
        conversations
          .filter((conversation) =>
            conversation.otherUser.username.includes(searchTerm)
          )
          .map((conversation) => {
            return (
              <Chat
                conversation={conversation}
                key={conversation.otherUser.username}
              />
            );
          })}
    </Box>
  );
};

export default Sidebar;
