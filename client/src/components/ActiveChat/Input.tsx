import React, { useState } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { postMessage } from "../../store/utils/thunkCreators";
import { ID, User, useDispatch } from "../../store/index";

const useStyles = makeStyles(() => ({
  root: {
    justifySelf: "flex-end",
    marginTop: 15,
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20,
  },
}));

export default function Input({
  user,
  conversationId,
  otherUser,
}: {
  user: User;
  conversationId: ID;
  otherUser: User;
}) {
  const classes = useStyles();
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const onSubmit = (event: any) => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: event.target.text.value,
      recipientId: otherUser.id,
      conversationId: conversationId,
      sender: conversationId ? null : user,
    };
    setText("");
    dispatch(postMessage(reqBody));
  };
  return (
    <form className={classes.root} onSubmit={onSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={(e) => setText(e.target.value)}
        />
      </FormControl>
    </form>
  );
}
