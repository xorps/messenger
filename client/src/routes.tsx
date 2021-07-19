import React, { useEffect, useState } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { fetchUser } from "./store/utils/thunkCreators";
import Signup from "./Signup";
import Login from "./Login";
import { Home, SnackbarError } from "./components";
import {
  isUser,
  isFetching,
  isUserError,
  useSelector,
  useDispatch,
} from "./store/index";

function HomeOrSignup() {
  const user = useSelector((state) => state.user);
  return isUser(user) ? <Home /> : <Signup />;
}

const Routes = () => {
  const user = useSelector((state) => state.user);
  const userId = isUser(user) ? user.id : null;
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const userError = isUserError(user) ? user.error : null;

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch, userId]);

  useEffect(() => {
    if (userError) {
      // check to make sure error is what we expect, in case we get an unexpected server error object
      if (typeof userError === "string") {
        setErrorMessage(userError);
      } else {
        setErrorMessage("Internal Server Error. Please try again");
      }
      setSnackBarOpen(true);
    }
  }, [userError]);

  if (isFetching(user) && user.isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {snackBarOpen && (
        <SnackbarError
          setSnackBarOpen={setSnackBarOpen}
          errorMessage={errorMessage}
          snackBarOpen={snackBarOpen}
        />
      )}
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Signup} />
        <Route exact path="/" component={HomeOrSignup} />
        <Route path="/home" component={Home} />
      </Switch>
    </>
  );
};

export default withRouter(Routes);
