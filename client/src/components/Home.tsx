import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import { logout, fetchConversations } from "../store/utils/thunkCreators";
import {
  isUser,
  useSelector,
  useDispatch,
  clearOnLogout,
} from "../store/index";

const useStyles = makeStyles(() => ({
  logout: {},
  root: {
    height: "97vh",
  },
}));

export default function Home() {
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const userId = isUser(user) ? user.id : null;

  useEffect(() => {
    setIsLoggedIn(true);
  }, [userId]);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout(userId));
    await dispatch(clearOnLogout());
  };

  if (!userId) {
    // If we were previously logged in, redirect to login instead of register
    if (isLoggedIn) return <Redirect to="/login" />;
    return <Redirect to="/register" />;
  }

  return (
    <>
      {/* logout button will eventually be in a dropdown next to username */}
      <Button className={classes.logout} onClick={handleLogout}>
        Logout
      </Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer />
        <ActiveChat />
      </Grid>
    </>
  );
}
