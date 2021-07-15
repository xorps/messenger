import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Avatar } from "@material-ui/core";
import VisibilitySensor from 'react-visibility-sensor';
import { useDispatch } from 'react-redux';
import { postMessageRead } from '../../store/utils/thunkCreators';

const useStyles = makeStyles(() => ({
  root: {
    display: "flex"
  },
  avatar: {
    height: 30,
    width: 30,
    marginRight: 11,
    marginTop: 6
  },
  usernameDate: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5
  },
  bubble: {
    backgroundImage: "linear-gradient(225deg, #6CC1FF 0%, #3A8DFF 100%)",
    borderRadius: "0 10px 10px 10px"
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: -0.2,
    padding: 8
  }
}));

const Bubble = ({message, otherUser, time}) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
    <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar>
    <Box>
      <Typography className={classes.usernameDate}>
        {otherUser.username} {time}
      </Typography>
      <Box className={classes.bubble}>
        <Typography className={classes.text}>{message.text}</Typography>
      </Box>
    </Box>
  </Box>
  );
}

const SensorBubble = ({message, otherUser, time}) => {
  const dispatch = useDispatch();
  const onChange = (isVisible) => {
    const {conversationId} = message;
    const messageId = message.id;
    if (isVisible) dispatch(postMessageRead({conversationId, messageId}));
  };
  return (
    <VisibilitySensor onChange={onChange}>
      <Bubble message={message} time={time} otherUser={otherUser} />
    </VisibilitySensor>
  );
}

const OtherUserBubble = ({message, time, otherUser}) =>
  message.read ? <Bubble       message={message} time={time} otherUser={otherUser} /> 
               : <SensorBubble message={message} time={time} otherUser={otherUser} />;

export default OtherUserBubble;
